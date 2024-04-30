import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Injectable } from '@nestjs/common'

interface DeleteCourierUseCaseRequest {
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right(null)
  }
}
