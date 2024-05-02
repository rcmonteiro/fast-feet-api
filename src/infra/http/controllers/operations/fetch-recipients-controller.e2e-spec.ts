import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchRecipientsUseCase } from './fetch-recipients-controller'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to fetch recipients', async () => {
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipients).toHaveLength(3)
  })

  it('should be able to fetch paginated recipients', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryRecipientsRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipients).toHaveLength(2)
  })
})
