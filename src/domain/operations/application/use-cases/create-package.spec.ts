import { Package } from '@/domain/operations/enterprise/entities/package'
import { makePackage } from 'test/factories/make-package'

import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { CreatePackageUseCase } from './create-package'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: CreatePackageUseCase

describe('Create Package Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    sut = new CreatePackageUseCase(inMemoryPackagesRepository)
  })

  it('should be able to create a package', async () => {
    const result = await sut.execute(makePackage())

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.packageOrder).toBeInstanceOf(Package)
      expect(inMemoryPackagesRepository.items).toHaveLength(1)
    }
  })
})
