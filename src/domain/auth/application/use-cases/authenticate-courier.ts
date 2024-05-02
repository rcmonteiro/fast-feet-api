import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../criptography/encrypter'
import { HashComparator } from '../criptography/hash-comparator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparator: HashComparator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCPF(cpf)

    if (!courier) {
      return left(new WrongCredentialsError())
    }

    if (courier.role !== 'COURIER') {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparator.compare(
      password,
      courier.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
      role: courier.role,
    })

    return right({ accessToken })
  }
}
