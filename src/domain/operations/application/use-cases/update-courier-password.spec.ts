import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { UpdateCourierPasswordUseCase } from './update-courier-password'

let fakeHasher: FakeHasher
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: UpdateCourierPasswordUseCase

describe('Update Courier Password Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new UpdateCourierPasswordUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
    )
  })

  it('should be able to set a new password for a courier', async () => {
    await inMemoryCouriersRepository.create(
      makeCourier({}, new UniqueEntityId('courier-1')),
    )
    const newPassword = 'new password'
    const result = await sut.execute({
      courierId: 'courier-1',
      password: newPassword,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.courier).toBeInstanceOf(Courier)
      expect(inMemoryCouriersRepository.items[0].password).toEqual(
        newPassword.concat('-hashed'),
      )
    }
  })
})
