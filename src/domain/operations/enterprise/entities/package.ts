import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PackageStatusChangeEvent } from '@/domain/delivery/enterprise/events/package-status-change-event'

export interface PackageProps {
  name: string
  recipientId: UniqueEntityId
  courierId?: UniqueEntityId | null
  postedAt: Date
  collectedAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
}

export class Package extends AggregateRoot<PackageProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  set recipientId(recipientId: UniqueEntityId) {
    this.props.recipientId = recipientId
  }

  get courierId(): UniqueEntityId | null | undefined {
    return this.props.courierId
  }

  set courierId(courierId: UniqueEntityId | null | undefined) {
    this.props.courierId = courierId
  }

  get postedAt(): Date {
    return this.props.postedAt
  }

  get collectedAt(): Date | null | undefined {
    return this.props.collectedAt
  }

  set collectedAt(collectedAt: Date | null | undefined) {
    this.props.collectedAt = collectedAt
    this.addDomainEvent(new PackageStatusChangeEvent(this, 'COLLECTED'))
  }

  get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  set deliveredAt(deliveredAt: Date | null | undefined) {
    this.props.deliveredAt = deliveredAt
    this.addDomainEvent(new PackageStatusChangeEvent(this, 'DELIVERED'))
  }

  get returnedAt(): Date | null | undefined {
    return this.props.returnedAt
  }

  set returnedAt(returnedAt: Date | null | undefined) {
    this.props.returnedAt = returnedAt
  }

  static create(
    props: Optional<PackageProps, 'postedAt'>,
    id?: UniqueEntityId,
  ) {
    const packageOrder = new Package(
      {
        ...props,
        postedAt: props.postedAt ?? new Date(),
      },
      id,
    )
    return packageOrder
  }
}
