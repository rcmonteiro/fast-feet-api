import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { Photo } from '../../enterprise/entities/photo'
import { InvalidPhotoTypeError } from './errors/invalid-photo-type'
import { UploadPhotoUseCase } from './upload-photo'

let inMemoryPhotosRepository: InMemoryPhotosRepository
let fakeUploader: FakeUploader
let sut: UploadPhotoUseCase

describe('Upload and Create Photo Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryPhotosRepository = new InMemoryPhotosRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadPhotoUseCase(inMemoryPhotosRepository, fakeUploader)
  })

  it('should be able to upload a file', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.photo).toBeInstanceOf(Photo)
      expect(fakeUploader.files).toHaveLength(1)
      expect(fakeUploader.files[0]).toEqual(
        expect.objectContaining({
          fileName: 'profile.png',
        }),
      )
    }
  })

  it('should not be able to upload a not allowed file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPhotoTypeError)
    }
  })
})
