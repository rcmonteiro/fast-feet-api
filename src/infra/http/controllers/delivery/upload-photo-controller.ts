import { InvalidPhotoTypeError } from '@/domain/delivery/application/use-cases/errors/invalid-photo-type'
import { UploadPhotoUseCase } from '@/domain/delivery/application/use-cases/upload-photo'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const MAX_FILE_SIZE = 1024 * 1024 * 3 // 2mb

@Controller('/photos')
export class UploadPhotoController {
  constructor(private uploadAndCreatePhoto: UploadPhotoUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreatePhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidPhotoTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { photo } = result.value
    return { photoId: photo.id.toString() }
  }
}
