import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Photo, PhotoProps } from '@/domain/delivery/enterprise/entities/photo'
import { PrismaPhotoMapper } from '@/infra/database/prisma/mappers/prisma-photo-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makePhoto = (
  override: Partial<PhotoProps> = {},
  id?: UniqueEntityId,
) => {
  const newPhoto = Photo.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )
  return newPhoto
}

@Injectable()
export class PhotoFactory {
  constructor(private db: PrismaService) {}

  async makeDbPhoto(data: Partial<PhotoProps> = {}): Promise<Photo> {
    const photo = makePhoto(data)

    await this.db.photo.create({
      data: PrismaPhotoMapper.toPrisma(photo),
    })

    return photo
  }
}
