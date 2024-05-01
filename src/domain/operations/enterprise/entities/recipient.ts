import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  city: string
  state: string
  postalCode: string
  address: string
  number: string
  complement?: string | null
  latitude: number
  longitude: number
}

export class Recipient extends Entity<RecipientProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get city(): string {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  get state(): string {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
  }

  get postalCode(): string {
    return this.props.postalCode
  }

  set postalCode(postalCode: string) {
    this.props.postalCode = postalCode
  }

  get address(): string {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
  }

  get number(): string {
    return this.props.number
  }

  set number(number: string) {
    this.props.number = number
  }

  get complement(): string | null | undefined {
    return this.props.complement
  }

  set complement(complement: string | null) {
    this.props.complement = complement
  }

  get latitude(): number {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  get longitude(): number {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(props, id)
    return recipient
  }
}
