import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AdminProps {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'COURIER'
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: AdminProps, id?: UniqueEntityId) {
    const admin = new Admin(props, id)
    return admin
  }
}
