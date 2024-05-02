import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/error/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'
import { PhotosRepository } from '../repositories/photos-repository'

interface DeliverPackageUseCaseRequest {
  packageId: string
  courierId: string
  photoId: string
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
    private photosRepository: PhotosRepository,
  ) {}

  async execute({
    packageId,
    courierId,
    photoId,
  }: DeliverPackageUseCaseRequest): Promise<DeliverPackageUseCaseResponse> {
    const packageOrder = await this.packagesRepository.findById(packageId)

    if (!packageOrder) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const photo = await this.photosRepository.findById(photoId)

    if (!photo) {
      return left(new NotAllowedError())
    }

    if (!packageOrder.courierId?.equals(courier.id)) {
      return left(new NotAllowedError())
    }

    photo.courierId = new UniqueEntityId(courierId)
    photo.packageId = new UniqueEntityId(packageId)
    await this.photosRepository.save(photo)

    packageOrder.deliveredAt = new Date()
    await this.packagesRepository.save(packageOrder)

    return right({
      packageOrder,
    })
  }
}
