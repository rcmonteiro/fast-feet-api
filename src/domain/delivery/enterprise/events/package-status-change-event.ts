import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Package } from '@/domain/operations/enterprise/entities/package'

export type TPackageStatus = 'COLLECTED' | 'DELIVERED'

export class PackageStatusChangeEvent implements DomainEvent {
  public ocurredAt: Date
  public packageOrder: Package
  public status: TPackageStatus

  constructor(packageOrder: Package, status: TPackageStatus) {
    this.packageOrder = packageOrder
    this.status = status
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.packageOrder.id
  }
}
