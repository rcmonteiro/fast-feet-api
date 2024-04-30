import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/auth/enterprise/entities/admin'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) => {
  const newAdmin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.number.int({ min: 100000000, max: 10000000000 }).toString(),
      password: faker.internet.password(),
      role: 'ADMIN',
      ...override,
    },
    id,
  )
  return newAdmin
}

@Injectable()
export class AdminFactory {
  constructor(private db: PrismaService) {}

  async makeDbAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    const adminData = PrismaAdminMapper.toPrisma(admin)

    await this.db.user.create({ data: { role: 'ADMIN', ...adminData } })

    return admin
  }
}
