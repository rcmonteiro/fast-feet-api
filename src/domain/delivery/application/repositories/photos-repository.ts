import { Photo } from '../../enterprise/entities/photo'

export abstract class PhotosRepository {
  abstract create(photo: Photo): Promise<void>
  abstract save(photo: Photo): Promise<void>
  abstract findById(id: string): Promise<Photo | null>
}
