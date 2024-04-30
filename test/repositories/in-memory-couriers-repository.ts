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

  async create(courier: Courier): Promise<void> {
    this.items.push(courier)
  }
}
