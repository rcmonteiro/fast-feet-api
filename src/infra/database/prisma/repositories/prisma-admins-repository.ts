import { AdminsRepository } from '@/domain/auth/application/repositories/admins-repository'
import { Admin } from '@/domain/auth/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private db: PrismaService) {}

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.db.user.findUnique({
      where: { id },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.db.user.findUnique({
      where: { email },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)
    await this.db.user.create({
      data,
    })
  }
}
