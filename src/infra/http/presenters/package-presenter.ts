import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/operations/enterprise/entities/package'

interface rawPackage {
  id: string
  recipient_id: string
  name: string
}

export abstract class PackagePresenter {
  static toHTTP(packageOrder: Package) {
    return {
      id: packageOrder.id.toString(),
      recipientId: packageOrder.recipientId.toString(),
      name: packageOrder.name,
    }
  }

  static rawToHTTP(packageOrder: rawPackage): Partial<Package> {
    console.log(packageOrder)
    return {
      id: new UniqueEntityId(packageOrder.id),
      recipientId: new UniqueEntityId(packageOrder.recipient_id),
      name: packageOrder.name,
    }
  }
}
