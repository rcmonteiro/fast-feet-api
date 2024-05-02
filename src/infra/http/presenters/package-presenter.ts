import { Package } from '@/domain/operations/enterprise/entities/package'

export abstract class PackagePresenter {
  static toHTTP(packageOrder: Package) {
    return {
      id: packageOrder.id.toString(),
      recipientId: packageOrder.recipientId.toString(),
      name: packageOrder.name,
    }
  }
}
