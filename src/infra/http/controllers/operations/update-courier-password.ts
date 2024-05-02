import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { HashGenerator } from '@/domain/auth/application/criptography/hash-generator'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

interface UpdateCourierPasswordUseCaseRequest {
  courierId: string
  password: string
}

type UpdateCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

@Injectable()
export class UpdateCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    courierId,
    password,
  }: UpdateCourierPasswordUseCaseRequest): Promise<UpdateCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    courier.password = hashedPassword

    await this.couriersRepository.save(courier)

    return right({
      courier,
    })
  }
}
