import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { AuthenticateCourierUseCase } from './authenticate-courier'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: AuthenticateCourierUseCase

describe('Authenticate Courier Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a courier', async () => {
    const courier = makeCourier({
      email: 'john-doe@me',
      password: await fakeHasher.hash('123123'),
    })
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      email: 'john-doe@me',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
    }
  })
})
