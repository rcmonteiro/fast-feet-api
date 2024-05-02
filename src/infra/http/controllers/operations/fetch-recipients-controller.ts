import { Either, right } from '@/core/either'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

interface FetchRecipientsUseCaseRequest {
  page: number
}

type FetchRecipientsUseCaseResponse = Either<
  null,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findMany({ page })

    return right({
      recipients,
    })
  }
}
