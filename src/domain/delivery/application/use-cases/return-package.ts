import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/error/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface ReturnPackageUseCaseRequest {
  packageId: string
  courierId: string
}

type ReturnPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    packageOrder: Package
  }
>

@Injectable()
export class ReturnPackageUseCase {
  constructor(
    private packagesRepository: PackagesRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    packageId,
    courierId,
  }: ReturnPackageUseCaseRequest): Promise<ReturnPackageUseCaseResponse> {
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

    packageOrder.returnedAt = new Date()

    await this.packagesRepository.save(packageOrder)

    return right({
      packageOrder,
    })
  }
}
