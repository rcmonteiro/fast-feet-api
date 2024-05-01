import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makePackage } from 'test/factories/make-package'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { DeletePackageUseCase } from './delete-package'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: DeletePackageUseCase

describe('Delete Package Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    sut = new DeletePackageUseCase(inMemoryPackagesRepository)
  })

  it('should be able to delete a package', async () => {
    await inMemoryPackagesRepository.create(
      makePackage({}, new UniqueEntityId('package-1')),
    )
    const result = await sut.execute({
      packageId: 'package-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPackagesRepository.items).toHaveLength(0)
  })
})
