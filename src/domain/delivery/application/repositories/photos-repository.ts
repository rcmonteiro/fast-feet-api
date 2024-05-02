import { Photo } from '../../enterprise/entities/photo'

export abstract class PhotosRepository {
  abstract create(photo: Photo): Promise<void>
}
