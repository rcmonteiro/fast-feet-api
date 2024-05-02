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
}
