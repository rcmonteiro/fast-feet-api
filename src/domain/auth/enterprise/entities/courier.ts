import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  email: string
  cpf: string
  password: string
  role: 'ADMIN' | 'COURIER'
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.role
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
