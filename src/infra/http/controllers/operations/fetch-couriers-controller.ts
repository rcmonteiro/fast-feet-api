import { Either, right } from '@/core/either'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

interface FetchCouriersUseCaseRequest {
  page: number
}

type FetchCouriersUseCaseResponse = Either<
  null,
  {
    couriers: Courier[]
  }
>

@Injectable()
export class FetchCouriersUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    page,
  }: FetchCouriersUseCaseRequest): Promise<FetchCouriersUseCaseResponse> {
    const couriers = await this.couriersRepository.findMany({ page })

    return right({
      couriers,
    })
  }
}
