import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Injectable } from '@nestjs/common'

interface DeletePackageUseCaseRequest {
  packageId: string
}

type DeletePackageUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeletePackageUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    packageId,
  }: DeletePackageUseCaseRequest): Promise<DeletePackageUseCaseResponse> {
    const packageOrder = await this.packagesRepository.findById(packageId)

    if (!packageOrder) {
      return left(new ResourceNotFoundError())
    }

    await this.packagesRepository.delete(packageOrder)

    return right(null)
  }
}
