import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Photo } from '../../enterprise/entities/photo'
import { PhotosRepository } from '../repositories/photos-repository'
import { Uploader } from '../storage/uploader'
import { InvalidPhotoTypeError } from './errors/invalid-photo-type'

interface UploadPhotoUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer // com arquivos maiores não vale a pena usar Buffer, teria que usar Stream
}

type UploadPhotoUseCaseResponse = Either<
  InvalidPhotoTypeError,
  {
    photo: Photo
  }
>

@Injectable()
export class UploadPhotoUseCase {
  constructor(
    private photosRepository: PhotosRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadPhotoUseCaseRequest): Promise<UploadPhotoUseCaseResponse> {
    if (!/^(image\/(png|jpeg|jpg))$/.test(fileType)) {
      return left(new InvalidPhotoTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const photo = Photo.create({
      title: fileName,
      url,
    })

    await this.photosRepository.create(photo)

    return right({ photo })
  }
}
