import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

interface UpdateRecipientUseCaseRequest {
  recipientId: string
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

type UpdateRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class UpdateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    name,
    city,
    state,
    postalCode,
    address,
    number,
    complement,
    latitude,
    longitude,
  }: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.city = city
    recipient.state = state
    recipient.postalCode = postalCode
    recipient.address = address
    recipient.number = number
    recipient.complement = complement ?? null
    recipient.latitude = latitude
    recipient.longitude = longitude

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
