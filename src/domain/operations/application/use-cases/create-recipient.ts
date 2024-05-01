import { Either, right } from '@/core/either'
import { HashGenerator } from '@/domain/auth/application/criptography/hash-generator'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  name: string
  city: string
  state: string
  postalCode: string
  address: string
  number: string
  complement?: string | null
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    city,
    state,
    postalCode,
    address,
    number,
    complement,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = await Recipient.create({
      name,
      city,
      state,
      postalCode,
      address,
      number,
      complement,
      latitude,
      longitude,
    })

    await this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
