import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeRecipient } from 'test/factories/make-recipient'

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateRecipientUseCase } from './create-recipient'

let fakeHasher: FakeHasher
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('Create Recipient Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository, fakeHasher)
  })

  it('should be able to create a recipient', async () => {
    const result = await sut.execute(makeRecipient())

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.recipient).toBeInstanceOf(Recipient)
      expect(inMemoryRecipientsRepository.items).toHaveLength(1)
    }
  })
})
