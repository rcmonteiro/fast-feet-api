import { UserAlreadyExistsError } from '@/domain/auth/application/use-cases/errors/user-already-exists-error'
import { Courier } from '@/domain/auth/enterprise/entities/courier'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'

let fakeHasher: FakeHasher
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: CreateCourierUseCase

describe('Create Courier Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new CreateCourierUseCase(inMemoryCouriersRepository, fakeHasher)
  })

  it('should be able to create a courier', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@me',
      cpf: '12478541288',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.courier).toBeInstanceOf(Courier)
      expect(inMemoryCouriersRepository.items[0].id).toEqual(
        result.value?.courier.id,
      )
    }
  })

  it('should be able to hash the password before registering a courier', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@me',
      cpf: '12478541288',
      password: '123123',
    })

    const hashedPassword = await fakeHasher.hash('123123')

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.courier).toBeInstanceOf(Courier)
      expect(inMemoryCouriersRepository.items[0].password).toEqual(
        hashedPassword,
      )
    }
  })

  it('should not be able create a courier with an existing CPF', async () => {
    await inMemoryCouriersRepository.create(makeCourier({ cpf: '12478541288' }))

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@me',
      cpf: '12478541288',
      password: '123123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
