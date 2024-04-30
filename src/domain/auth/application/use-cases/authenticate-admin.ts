import { Either, left, right } from '@/core/either'
import { AdminsRepository } from '@/domain/auth/application/repositories/admins-repository'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../criptography/encrypter'
import { HashComparator } from '../criptography/hash-comparator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateAdminUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparator: HashComparator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return left(new WrongCredentialsError())
    }

    if (admin.role !== 'ADMIN') {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparator.compare(
      password,
      admin.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    })

    return right({ accessToken })
  }
}
