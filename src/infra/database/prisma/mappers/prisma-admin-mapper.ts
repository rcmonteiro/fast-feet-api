import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/auth/enterprise/entities/admin'
import { Prisma, User as PrismaAdmin } from '@prisma/client'

export abstract class PrismaAdminMapper {
  public static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityId(raw.id),
    )
  }

  public static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
    }
  }
}
