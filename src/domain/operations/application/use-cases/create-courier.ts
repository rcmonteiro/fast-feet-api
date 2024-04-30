import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/auth/application/criptography/hash-generator'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { UserAlreadyExistsError } from '@/domain/auth/application/use-cases/errors/user-already-exists-error'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

interface CreateCourierUseCaseRequest {
  name: string
  email: string
  cpf: string
  password: string
}

type CreateCourierUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    courier: Courier
  }
>

@Injectable()
export class CreateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    cpf,
    password,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const admin = await this.couriersRepository.findByCPF(cpf)

    if (admin) {
      return left(new UserAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = await Courier.create({
      name,
      email,
      cpf,
      password: hashedPassword,
      role: 'COURIER',
    })

    await this.couriersRepository.create(courier)

    return right({
      courier,
    })
  }
}
