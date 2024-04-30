import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private db: PrismaService) {}

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.db.user.findUnique({
      where: { id },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByEmail(email: string): Promise<Courier | null> {
    const courier = await this.db.user.findUnique({
      where: { email },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)
    await this.db.user.create({
      data,
    })
  }
}
