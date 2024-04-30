import { Admin } from '@/domain/auth/enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(student: Admin): Promise<void>
  abstract findById(id: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
}
