import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Prisma, User as PrismaCourier } from '@prisma/client'

export abstract class PrismaCourierMapper {
  public static toDomain(raw: PrismaCourier): Courier {
    return Courier.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityId(raw.id),
    )
  }

  public static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      email: courier.email,
      cpf: courier.cpf,
      password: courier.password,
    }
  }
}
