import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UpdateRecipientUseCase } from './update-recipient-controller'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: UpdateRecipientUseCase

describe('Update Recipient Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new UpdateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to update a recipient', async () => {
    const recipient = await makeRecipient({}, new UniqueEntityId('recipient-1'))
    recipient.name = 'John Doe'
    await inMemoryRecipientsRepository.create(recipient)
    const result = await sut.execute({
      recipientId: 'recipient-1',
      name: 'John Doe - Updated',
      city: recipient.city,
      state: recipient.state,
      postalCode: recipient.postalCode,
      address: recipient.address,
      number: recipient.number,
      complement: recipient.complement,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.recipient).toBeInstanceOf(Recipient)
      expect(inMemoryRecipientsRepository.items[0].name).toEqual(
        'John Doe - Updated',
      )
    }
  })
})
