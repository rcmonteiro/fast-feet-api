import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { makeCourier } from 'test/factories/make-courier'
import { makePackage } from 'test/factories/make-package'
import { makePhoto } from 'test/factories/make-photo'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository'
import { DeliverPackageUseCase } from './deliver-package'

let inMemoryPackagesRepository: InMemoryPackagesRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryPhotosRepository: InMemoryPhotosRepository
let sut: DeliverPackageUseCase

describe('Deliver Package Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryPhotosRepository = new InMemoryPhotosRepository()
    sut = new DeliverPackageUseCase(
      inMemoryPackagesRepository,
      inMemoryCouriersRepository,
      inMemoryPhotosRepository,
    )
  })

  it('should be able to deliver a package', async () => {
    const courier = makeCourier()
    await inMemoryCouriersRepository.create(courier)
    const photo = makePhoto()
    await inMemoryPhotosRepository.create(photo)
    const packageOrder = await makePackage(
      { courierId: courier.id },
      new UniqueEntityId('package-1'),
    )
    await inMemoryPackagesRepository.create(packageOrder)

    const result = await sut.execute({
      packageId: 'package-1',
      courierId: courier.id.toString(),
      photoId: photo.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.packageOrder).toBeInstanceOf(Package)
      expect(inMemoryPackagesRepository.items[0].deliveredAt).toEqual(
        expect.any(Date),
      )
    }
  })
})
