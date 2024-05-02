import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'

export class InMemoryPackagesRepository implements PackagesRepository {
  public items: Package[] = []

  async findById(id: string): Promise<Package | null> {
    const packageOrder = this.items.find((item) => item.id.toString() === id)
    return packageOrder ?? null
  }

  async findMany(
    { page }: PaginationParams,
    courierId?: string,
  ): Promise<Package[]> {
    if (courierId) {
      return this.items
        .filter((item) => item.courierId?.equals(new UniqueEntityId(courierId)))
        .slice((page - 1) * 20, page * 20)
    }
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async create(packageOrder: Package): Promise<void> {
    this.items.push(packageOrder)
  }

  async save(packageOrder: Package): Promise<void> {
    const findIndex = this.items.findIndex((item) =>
      item.id.equals(packageOrder.id),
    )
    if (findIndex >= 0) {
      this.items[findIndex] = packageOrder
      DomainEvents.dispatchEventsForAggregate(packageOrder.id)
    }
  }

  async delete(packageOrder: Package): Promise<void> {
    const findIndex = this.items.findIndex((item) =>
      item.id.equals(packageOrder.id),
    )
    if (findIndex >= 0) {
      this.items.splice(findIndex, 1)
    }
  }
}
