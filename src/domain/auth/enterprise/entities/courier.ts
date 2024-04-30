import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'COURIER'
}

export class Courier extends Entity<CourierProps> {
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

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
