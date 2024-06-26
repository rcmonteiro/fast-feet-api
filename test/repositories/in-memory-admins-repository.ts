import { AdminsRepository } from '@/domain/auth/application/repositories/admins-repository'
import { Admin } from '@/domain/auth/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.id.toString() === id)
    return admin ?? null
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.cpf === cpf)
    return admin ?? null
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }
}
