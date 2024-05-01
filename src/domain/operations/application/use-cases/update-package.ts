import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface UpdatePackageUseCaseRequest {
  packageId: string
  recipientId: string
  name: string
}

type UpdatePackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    packageOrder: Package
  }
>

@Injectable()
export class UpdatePackageUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    packageId,
    recipientId,
    name,
  }: UpdatePackageUseCaseRequest): Promise<UpdatePackageUseCaseResponse> {
    const packageOrder = await this.packagesRepository.findById(packageId)

    if (!packageOrder) {
      return left(new ResourceNotFoundError())
    }

    packageOrder.name = name
    packageOrder.recipientId = new UniqueEntityId(recipientId)

    await this.packagesRepository.save(packageOrder)

    return right({
      packageOrder,
    })
  }
}
