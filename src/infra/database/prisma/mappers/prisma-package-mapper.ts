import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Prisma, Package as PrismaPackage } from '@prisma/client'

export abstract class PrismaPackageMapper {
  public static toDomain(raw: PrismaPackage): Package {
    return Package.create(
      {
        name: raw.name,
        recipientId: new UniqueEntityId(raw.recipientId),
        courierId: raw.courierId ? new UniqueEntityId(raw.courierId) : null,
        postedAt: raw.postedAt,
        collectedAt: raw.collectedAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  public static toPrisma(
    packageOrder: Package,
  ): Prisma.PackageUncheckedCreateInput {
    return {
      id: packageOrder.id.toString(),
      name: packageOrder.name,
      recipientId: packageOrder.recipientId.toString(),
      courierId: packageOrder.courierId
        ? packageOrder.courierId.toString()
        : null,
      postedAt: packageOrder.postedAt,
      collectedAt: packageOrder.collectedAt,
      deliveredAt: packageOrder.deliveredAt,
      returnedAt: packageOrder.returnedAt,
    }
  }
}
