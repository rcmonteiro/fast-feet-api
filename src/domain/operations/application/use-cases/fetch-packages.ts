import { Either, right } from '@/core/either'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface FetchPackagesUseCaseRequest {
  page: number
  courierId?: string
  distance?: number
  userLatitude?: number
  userLongitude?: number
}

type FetchPackagesUseCaseResponse = Either<
  null,
  {
    packages: Package[]
  }
>

@Injectable()
export class FetchPackagesUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    page,
    courierId,
    distance,
    userLatitude,
    userLongitude,
  }: FetchPackagesUseCaseRequest): Promise<FetchPackagesUseCaseResponse> {
    const packages = await this.packagesRepository.findMany(
      { page },
      courierId,
      distance,
      userLatitude,
      userLongitude,
    )

    return right({
      packages,
    })
  }
}
