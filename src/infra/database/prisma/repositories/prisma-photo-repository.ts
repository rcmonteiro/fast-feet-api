import { PhotosRepository } from '@/domain/delivery/application/repositories/photos-repository'
import { Photo } from '@/domain/delivery/enterprise/entities/photo'
import { Injectable } from '@nestjs/common'
import { PrismaPhotoMapper } from '../mappers/prisma-photo-mapper'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPhotosRepository implements PhotosRepository {
  constructor(private prisma: PrismaService) {}

  async create(photo: Photo): Promise<void> {
    const data = PrismaPhotoMapper.toPrisma(photo)

    await this.prisma.photo.create({
      data,
    })
  }

  async save(photo: Photo): Promise<void> {
    const data = PrismaPhotoMapper.toPrisma(photo)

    await this.prisma.photo.update({
      where: {
        id: photo.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<Photo | null> {
    const photo = await this.prisma.photo.findUnique({
      where: {
        id,
      },
    })
    return photo ? PrismaPhotoMapper.toDomain(photo) : null
  }
}
