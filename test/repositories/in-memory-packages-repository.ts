import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { Package } from '@/domain/operations/enterprise/entities/package'
import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'

export class InMemoryPackagesRepository implements PackagesRepository {
  public items: Package[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findById(id: string): Promise<Package | null> {
    const packageOrder = this.items.find((item) => item.id.toString() === id)
    return packageOrder ?? null
  }

  async findMany(
    { page }: PaginationParams,
    courierId?: string,
    distance?: number,
    userLatitude?: number,
    userLongitude?: number,
  ): Promise<Package[]> {
    let packages = this.items
    if (courierId) {
      packages = packages.filter((item) =>
        item.courierId?.equals(new UniqueEntityId(courierId)),
      )
    }
    if (distance && userLatitude && userLongitude) {
      const recipients = this.inMemoryRecipientsRepository.items.filter(
        (item) => {
          const distance = getDistanceBetweenCoordinates(
            {
              latitude: userLatitude,
              longitude: userLongitude,
            },
            {
              latitude: item.latitude,
              longitude: item.longitude,
            },
          )
          return distance < 10
        },
      )
      packages = packages.filter((item) =>
        recipients.some((recipient) => recipient.id === item.recipientId),
      )
    }
    return packages.slice((page - 1) * 20, page * 20)
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
