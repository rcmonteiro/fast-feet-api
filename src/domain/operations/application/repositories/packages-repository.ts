import { PaginationParams } from '@/core/repositories/pagination-params'
import { Package } from '@/domain/operations/enterprise/entities/package'

export abstract class PackagesRepository {
  abstract create(packageOrder: Package): Promise<void>
  abstract save(packageOrder: Package): Promise<void>
  abstract delete(packageOrder: Package): Promise<void>
  abstract findById(id: string): Promise<Package | null>
  abstract findMany(
    params: PaginationParams,
    courierId?: string,
    distance?: number,
    userLatitude?: number,
    userLongitude?: number,
  ): Promise<Package[]>
}
