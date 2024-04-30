import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { DeleteCourierUseCase } from './delete-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: DeleteCourierUseCase

describe('Delete Courier Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to delete a courier', async () => {
    await inMemoryCouriersRepository.create(
      makeCourier({}, new UniqueEntityId('courier-1')),
    )
    const result = await sut.execute({
      courierId: 'courier-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
})
