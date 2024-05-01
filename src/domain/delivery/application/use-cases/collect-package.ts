import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface CollectPackageUseCaseRequest {
  packageId: string
  courierId: string
}

type CollectPackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    packageOrder: Package
  }
>

@Injectable()
export class CollectPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    packageId,
    courierId,
  }: CollectPackageUseCaseRequest): Promise<CollectPackageUseCaseResponse> {
    const packageOrder = await this.packagesRepository.findById(packageId)

    if (!packageOrder) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    packageOrder.collectedAt = new Date()
    packageOrder.courierId = new UniqueEntityId(courierId)

    await this.packagesRepository.save(packageOrder)

    return right({
      packageOrder,
    })
  }
}
