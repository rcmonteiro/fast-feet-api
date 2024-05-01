import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makePackage } from 'test/factories/make-package'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { FetchMyPackagesUseCase } from './fetch-my-packages'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: FetchMyPackagesUseCase

describe('Fetch My Packages Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
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
})
