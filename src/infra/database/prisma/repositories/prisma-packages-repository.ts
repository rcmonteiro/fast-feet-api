import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'
import {
  PrismaPackageMapper,
  rawPackage,
} from '../mappers/prisma-package-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPackagesRepository implements PackagesRepository {
  private readonly PAGE_SIZE = 20

  constructor(private db: PrismaService) {}

  async findById(id: string): Promise<Package | null> {
    const packageOrder = await this.db.package.findUnique({
      where: { id },
    })

    if (!packageOrder) {
      return null
    }

    return PrismaPackageMapper.toDomain(packageOrder)
  }

  async findMany(
    { page }: PaginationParams,
    courierId?: string,
    distance?: number,
    userLatitude?: number,
    userLongitude?: number,
  ): Promise<Package[]> {
    const packages = await this.db.$queryRawUnsafe<rawPackage[]>(`
      SELECT
        P.id, P.name, P.recipient_id as recipientId
      FROM packages as P
      INNER JOIN recipients as R ON R.id = P.recipient_id
      WHERE 1 = 1
        ${courierId ? `AND P.courier_id = '${courierId}'` : ''}
        ${distance ? `AND ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= ${distance}` : ''}
      LIMIT ${this.PAGE_SIZE}
      OFFSET ${(page - 1) * this.PAGE_SIZE}
    `)

    return packages.map(PrismaPackageMapper.rawToDomain)
  }

  async create(packageOrder: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(packageOrder)
    await this.db.package.create({
      data,
    })
  }

  async save(packageOrder: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(packageOrder)
    await this.db.package.update({
      where: {
        id: packageOrder.id.toString(),
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(packageOrder.id)
  }

  async delete(packageOrder: Package): Promise<void> {
    await this.db.package.delete({
      where: {
        id: packageOrder.id.toString(),
      },
    })
  }
}
