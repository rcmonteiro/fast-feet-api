import { Either, right } from '@/core/either'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { Injectable } from '@nestjs/common'

interface FetchMyPackagesUseCaseRequest {
  page: number
  courierId: string
}

type FetchMyPackagesUseCaseResponse = Either<
  null,
  {
    packages: Package[]
  }
>

@Injectable()
export class FetchMyPackagesUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute({
    page,
    courierId,
  }: FetchMyPackagesUseCaseRequest): Promise<FetchMyPackagesUseCaseResponse> {
    const packages = await this.packagesRepository.findMany({ page }, courierId)

    return right({
      packages,
    })
  }
}
