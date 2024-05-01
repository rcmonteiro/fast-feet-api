import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface CreatePackageUseCaseRequest {
  name: string
  recipientId: UniqueEntityId
}

type CreatePackageUseCaseResponse = Either<
  null,
  {
    packageOrder: Package
  }
>

@Injectable()
export class CreatePackageUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    name,
    recipientId,
  }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
    const packageOrder = await Package.create({
      name,
      recipientId,
    })

    await this.packagesRepository.create(packageOrder)

    return right({
      packageOrder,
    })
  }
}
