import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface PhotoProps {
  title: string
  url: string
  courierId?: UniqueEntityId | null
  packageId?: UniqueEntityId | null
}

export class Photo extends Entity<PhotoProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get courierId(): UniqueEntityId | null | undefined {
    return this.props.courierId
  }

  set courierId(courierId: UniqueEntityId | null | undefined) {
    this.props.courierId = courierId
  }

  get packageId(): UniqueEntityId | null | undefined {
    return this.props.packageId
  }

  set packageId(packageId: UniqueEntityId | null | undefined) {
    this.props.packageId = packageId
  }

  static create(props: PhotoProps, id?: UniqueEntityId) {
    const photo = new Photo(props, id)

    return photo
  }
}
