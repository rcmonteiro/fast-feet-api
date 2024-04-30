import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  private readonly PAGE_SIZE = 20

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

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = await this.db.user.findUnique({
      where: { cpf },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async findMany({ page }: PaginationParams): Promise<Courier[]> {
    const couriers = await this.db.user.findMany({
      take: this.PAGE_SIZE,
      skip: (page - 1) * this.PAGE_SIZE,
    })

    return couriers.map(PrismaCourierMapper.toDomain)
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)
    await this.db.user.create({
      data,
    })
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)
    await this.db.user.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    })
  }

  async delete(courier: Courier): Promise<void> {
    await this.db.user.delete({
      where: {
        id: courier.id.toString(),
      },
    })
  }
}
