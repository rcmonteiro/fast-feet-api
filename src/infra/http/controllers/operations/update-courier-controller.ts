import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

interface UpdateCourierUseCaseRequest {
  courierId: string
  name: string
}

type UpdateCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

@Injectable()
export class UpdateCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
    name,
  }: UpdateCourierUseCaseRequest): Promise<UpdateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name

    await this.couriersRepository.save(courier)

    return right({
      courier,
    })
  }
}
