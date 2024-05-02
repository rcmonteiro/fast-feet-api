import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PhotosRepository } from '@/domain/delivery/application/repositories/photos-repository'
import { Photo } from '@/domain/delivery/enterprise/entities/photo'

export class InMemoryPhotosRepository implements PhotosRepository {
  public items: Photo[] = []

  async create(photo: Photo): Promise<void> {
    this.items.push(photo)
  }

  async save(photo: Photo): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(photo.id))

    this.items[itemIndex] = photo
  }

  async findById(id: string): Promise<Photo | null> {
    return (
      this.items.find((item) => item.id.equals(new UniqueEntityId(id))) || null
    )
  }
}
