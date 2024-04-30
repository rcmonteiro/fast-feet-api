import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { UpdateCourierUseCase } from './update-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: UpdateCourierUseCase

describe('Update Courier Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new UpdateCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to update a courier', async () => {
    await inMemoryCouriersRepository.create(
      makeCourier({ cpf: '12478541288' }, new UniqueEntityId('courier-1')),
    )
    const result = await sut.execute({
      courierId: 'courier-1',
      name: 'John Doe - Updated',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.courier).toBeInstanceOf(Courier)
      expect(inMemoryCouriersRepository.items[0].name).toEqual(
        'John Doe - Updated',
      )
    }
  })
})
