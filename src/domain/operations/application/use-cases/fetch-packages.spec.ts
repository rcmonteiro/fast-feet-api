import { makePackage } from 'test/factories/make-package'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { FetchPackagesUseCase } from './fetch-packages'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: FetchPackagesUseCase

describe('Fetch Packages Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    sut = new FetchPackagesUseCase(inMemoryPackagesRepository)
  })

  it('should be able to fetch packages', async () => {
    await inMemoryPackagesRepository.create(makePackage())
    await inMemoryPackagesRepository.create(makePackage())
    await inMemoryPackagesRepository.create(makePackage())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.packages).toHaveLength(3)
  })

  it('should be able to fetch paginated packages', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryPackagesRepository.create(makePackage())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.packages).toHaveLength(2)
  })
})
