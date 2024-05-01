import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { makeCourier } from 'test/factories/make-courier'
import { makePackage } from 'test/factories/make-package'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { CollectPackageUseCase } from './collect-package'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: CollectPackageUseCase

describe('Collect Package Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new CollectPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryCouriersRepository,
    )
  })

  it('should be able to collect a package', async () => {
    const packageOrder = await makePackage({}, new UniqueEntityId('package-1'))
    await inMemoryPackagesRepository.create(packageOrder)
    const courier = await makeCourier()
    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      packageId: 'package-1',
      courierId: courier.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.packageOrder).toBeInstanceOf(Package)
      expect(inMemoryPackagesRepository.items[0].collectedAt).toEqual(
        expect.any(Date),
      )
    }
  })
})
