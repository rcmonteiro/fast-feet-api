import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { AuthenticateAdminUseCase } from './authenticate-admin'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: AuthenticateAdminUseCase

describe('Authenticate Admin Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a admin', async () => {
    const admin = makeAdmin({
      cpf: 12345678974,
      password: await fakeHasher.hash('123123'),
    })
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: 12345678974,
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
