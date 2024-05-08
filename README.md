# API - Fast Feet

## Regras da aplicação

[x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
[x] Deve ser possível realizar login com CPF e Senha
[x] Deve ser possível realizar o CRUD dos entregadores
[x] Deve ser possível realizar o CRUD das encomendas
[x] Deve ser possível realizar o CRUD dos destinatários
[x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
[x] Deve ser possível retirar uma encomenda
[x] Deve ser possível marcar uma encomenda como entregue
[x] Deve ser possível marcar uma encomenda como devolvida
[x] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
[x] Deve ser possível alterar a senha de um usuário
[x] Deve ser possível listar as entregas de um usuário
[x] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

## Regras de negócio

[x] Somente usuário do tipo `admin` pode realizar operações de CRUD nas encomendas
[x] Somente usuário do tipo `admin` pode realizar operações de CRUD dos entregadores
[x] Somente usuário do tipo `admin` pode realizar operações de CRUD nas destinatários
[x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
[x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
[x] Somente o `admin` pode alterar a senha de um usuário
[x] Não deve ser possível um entregador listar as encomendas de outro entregador

# Docker

## Dockerfile comentado
```docker
# Usando a imagem do node versão 20 alpine, para 
# melhor performance e deixar a imagem o menor possível
FROM node:20.13.0-alpine3.19 AS base

# Configurações para usar o pnpm como package manager
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copiando todos os arquivos da aplicação
COPY . /app
WORKDIR /app

# Criando uma etapa para instalar as dependências de prod
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Criando uma etapa para instalar as dependências de desenvolvimento
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm i @prisma+client
RUN pnpm prisma generate
RUN pnpm run build

# Fazendo a cópia dos arquivos e rodando a aplicação
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "pnpm", "start:migrate:prod" ]
```

## docker-compose comentado
```docker
services:
  # serviço do postgress
  postgres:
    container_name: fast-feet-pg
    image: bitnami/postgresql
    restart: always
    ports:
      - 5432:5432
    # variáveis para conexão
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: fast-feet
    # volume personalizado
    volumes:
      - db:/data/postgres
    networks:
    # rede personalizada
      - fast-feet-network
    # healthcheck para usar como test de dependência na api
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # serviço do redis
  cache:
    container_name: fast-feet-cache
    image: bitnami/redis
    ports:
      - 6379:6379
    # forçando aceitar senha vazia (só para fins educacionais)
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
    # volume personalizado
    volumes:
      - redis:/data
    # rede personalizada
    networks:
      - fast-feet-network
    # healthcheck para usar como test de dependência na api
    healthcheck:
      test: [ "CMD", "redis-cli", "--raw", "incr", "ping" ]
      interval: 5s
      timeout: 5s
      retries: 5
  
  # serviço da api nest, declarada no Dockerfile
  fast-feet-api:
    build:
      context: .
    container_name: fast-feet-api
    ports:
      - 3001:3333
    # dependências do cache e postgress para a api não falhar
    depends_on:
      postgres:
        condition: service_healthy
      cache:
        condition: service_healthy
    # usando a mesma rede para tudo ficar acessível
    networks:
      - fast-feet-network

# rede personalizada para todos os serviços
networks:
  fast-feet-network:
    driver: bridge
    external : true

# volumes do postgress e redis
volumes:
  db:
  redis:
```

## Como subir as imagens

```bash
# Rodar primeiro o build das imagens para validar que tudo tá certo
docker-compose build

# Rodar as imagens e ficar vendo os logs para conferir se tudo deu certo
docker-compose up

# Dando certo, podemos liberar o console, e rodar a aplicação detached
docker-compose up -d
```