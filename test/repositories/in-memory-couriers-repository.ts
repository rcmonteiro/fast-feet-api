import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { Courier } from '@/domain/auth/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findById(id: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.id.toString() === id)
    return courier ?? null
  }

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = this.items.find((item) => item.cpf === cpf)
    return courier ?? null
  }

  async findMany({ page }: PaginationParams): Promise<Courier[]> {
    const couriers = this.items.slice((page - 1) * 20, page * 20)
    return couriers
  }

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }

  async save(courier: Courier): Promise<void> {
    const findIndex = this.items.findIndex((item) => item.id.equals(courier.id))
    if (findIndex >= 0) {
      this.items[findIndex] = courier
    }
  }

  async delete(courier: Courier): Promise<void> {
    const findIndex = this.items.findIndex((item) => item.id.equals(courier.id))
    if (findIndex >= 0) {
      this.items.splice(findIndex, 1)
    }
  }
}
