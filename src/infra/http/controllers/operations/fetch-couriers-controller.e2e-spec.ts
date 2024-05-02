import { makeCourier } from 'test/factories/make-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { FetchCouriersUseCase } from './fetch-couriers-controller'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: FetchCouriersUseCase

describe('Fetch Couriers Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new FetchCouriersUseCase(inMemoryCouriersRepository)
  })

  it('should be able to fetch couriers', async () => {
    await inMemoryCouriersRepository.create(makeCourier())
    await inMemoryCouriersRepository.create(makeCourier())
    await inMemoryCouriersRepository.create(makeCourier())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.couriers).toHaveLength(3)
  })

  it('should be able to fetch paginated couriers', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryCouriersRepository.create(makeCourier())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.couriers).toHaveLength(2)
  })
})
