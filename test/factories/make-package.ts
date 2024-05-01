import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Package,
  PackageProps,
} from '@/domain/operations/enterprise/entities/package'
import { PrismaPackageMapper } from '@/infra/database/prisma/mappers/prisma-package-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makePackage = (
  override: Partial<PackageProps> = {},
  id?: UniqueEntityId,
) => {
  const newPackage = Package.create(
    {
      recipientId: new UniqueEntityId(),
      name: faker.commerce.productName(),
      postedAt: faker.date.recent(),
      ...override,
    },
    id,
  )
  return newPackage
}

@Injectable()
export class PackageFactory {
  constructor(private db: PrismaService) {}

  async makeDbPackage(data: Partial<PackageProps> = {}): Promise<Package> {
    const packageOrder = makePackage(data)

    await this.db.package.create({
      data: PrismaPackageMapper.toPrisma(packageOrder),
    })

    return packageOrder
  }
}
