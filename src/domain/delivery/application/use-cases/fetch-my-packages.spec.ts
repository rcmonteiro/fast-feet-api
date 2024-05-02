import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makePackage } from 'test/factories/make-package'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchMyPackagesUseCase } from './fetch-my-packages'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: FetchMyPackagesUseCase

describe('Fetch My Packages Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryPackagesRepository = new InMemoryPackagesRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchMyPackagesUseCase(inMemoryPackagesRepository)
  })

  it('should be able to fetch my packages', async () => {
    await inMemoryPackagesRepository.create(
      makePackage({ courierId: new UniqueEntityId('courier-1') }),
    )
    await inMemoryPackagesRepository.create(
      makePackage({ courierId: new UniqueEntityId('courier-1') }),
    )
    await inMemoryPackagesRepository.create(makePackage())

    const result = await sut.execute({
      page: 1,
      courierId: 'courier-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.packages).toHaveLength(2)
  })

  it('should be able to fetch my packages near my localization', async () => {
    const recipient = makeRecipient({
      latitude: -23.5505199,
      longitude: -46.6333093,
    })
    inMemoryRecipientsRepository.create(recipient)

    await inMemoryPackagesRepository.create(
      makePackage({
        courierId: new UniqueEntityId('courier-1'),
        recipientId: recipient.id,
      }),
    )
    await inMemoryPackagesRepository.create(
      makePackage({ courierId: new UniqueEntityId('courier-1') }),
    )
    await inMemoryPackagesRepository.create(makePackage())

    const result = await sut.execute({
      page: 1,
      courierId: 'courier-1',
      distance: 100,
      userLatitude: -23.5505199,
      userLongitude: -46.6333093,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.packages).toHaveLength(1)
  })
})
