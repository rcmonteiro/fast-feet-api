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
[ ] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
[ ] Deve ser possível alterar a senha de um usuário
[x] Deve ser possível listar as entregas de um usuário
[ ] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

## Regras de negócio

[ ] Somente usuário do tipo `admin` pode realizar operações de CRUD nas encomendas
[ ] Somente usuário do tipo `admin` pode realizar operações de CRUD dos entregadores
[ ] Somente usuário do tipo `admin` pode realizar operações de CRUD nas destinatários
[ ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
[x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
[ ] Somente o `admin` pode alterar a senha de um usuário
[ ] Não deve ser possível um entregador listar as encomendas de outro entregador

