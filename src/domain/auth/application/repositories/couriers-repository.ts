import { Courier } from '@/domain/auth/enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>
  abstract findById(id: string): Promise<Courier | null>
  abstract findByEmail(email: string): Promise<Courier | null>
}
