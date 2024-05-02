import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface PhotoProps {
  title: string
  url: string
}

export class Photo extends Entity<PhotoProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: PhotoProps, id?: UniqueEntityId) {
    const photo = new Photo(props, id)

    return photo
  }
}
