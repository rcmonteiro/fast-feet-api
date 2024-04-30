import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../criptography/encrypter'
import { HashComparator } from '../criptography/hash-comparator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateCourierUseCaseRequest {
  email: string
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
    email,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const student = await this.couriersRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparator.compare(
      password,
      student.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
