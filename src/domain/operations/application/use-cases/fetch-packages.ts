import { Either, right } from '@/core/either'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface FetchPackagesUseCaseRequest {
  page: number
  courierId?: string
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
  }: FetchPackagesUseCaseRequest): Promise<FetchPackagesUseCaseResponse> {
    const packages = await this.packagesRepository.findMany({ page }, courierId)

    return right({
      packages,
    })
  }
}
