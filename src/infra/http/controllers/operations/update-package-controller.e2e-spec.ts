import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { makePackage } from 'test/factories/make-package'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { UpdatePackageUseCase } from './update-package-controller'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let sut: UpdatePackageUseCase

describe('Update Package Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    sut = new UpdatePackageUseCase(inMemoryPackagesRepository)
  })

  it('should be able to update a package', async () => {
    const packageOrder = await makePackage({}, new UniqueEntityId('package-1'))
    await inMemoryPackagesRepository.create(packageOrder)
    const result = await sut.execute({
      packageId: 'package-1',
      name: 'John Doe - Updated',
      recipientId: packageOrder.recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.packageOrder).toBeInstanceOf(Package)
      expect(inMemoryPackagesRepository.items[0].name).toEqual(
        'John Doe - Updated',
      )
    }
  })
})
