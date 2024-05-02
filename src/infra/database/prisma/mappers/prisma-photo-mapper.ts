import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Photo } from '@/domain/delivery/enterprise/entities/photo'
import { Prisma, Photo as PrismaPhoto } from '@prisma/client'

export class PrismaPhotoMapper {
  static toDomain(raw: PrismaPhoto): Photo {
    return Photo.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(photo: Photo): Prisma.PhotoUncheckedCreateInput {
    return {
      id: photo.id.toString(),
      title: photo.title,
      url: photo.url,
    }
  }
}
