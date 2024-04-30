import { PaginationParams } from '@/core/repositories/pagination-params'
import { Courier } from '@/domain/auth/enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>
  abstract save(courier: Courier): Promise<void>
  abstract delete(courier: Courier): Promise<void>
  abstract findById(id: string): Promise<Courier | null>
  abstract findByCPF(cpf: string): Promise<Courier | null>
  abstract findMany(params: PaginationParams): Promise<Courier[]>
}
