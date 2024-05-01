import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/error/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface DeliverPackageUseCaseRequest {
  packageId: string
  courierId: string
}

type DeliverPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    packageOrder: Package
  }
>

@Injectable()
export class DeliverPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    packageId,
    courierId,
  }: DeliverPackageUseCaseRequest): Promise<DeliverPackageUseCaseResponse> {
    const packageOrder = await this.packagesRepository.findById(packageId)

    if (!packageOrder) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    if (!packageOrder.courierId?.equals(courier.id)) {
      return left(new NotAllowedError())
    }

    packageOrder.deliveredAt = new Date()

    await this.packagesRepository.save(packageOrder)

    return right({
      packageOrder,
    })
  }
}
