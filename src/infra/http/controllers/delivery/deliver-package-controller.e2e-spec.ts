import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { PackageFactory } from 'test/factories/make-package'
import { PhotoFactory } from 'test/factories/make-photo'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Collect Package (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let db: PrismaService
  let packageFactory: PackageFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory
  let photoFactory: PhotoFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PackageFactory,
        RecipientFactory,
        CourierFactory,
        PhotoFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    db = moduleRef.get(PrismaService)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    courierFactory = moduleRef.get(CourierFactory)
    photoFactory = moduleRef.get(PhotoFactory)

    await app.init()
  })

  test('[PATCH] /packages/:packageId/deliver', async () => {
    const photo = await photoFactory.makeDbPhoto()
    const courier = await courierFactory.makeDbCourier()
    const recipient = await recipientFactory.makeDbRecipient()
    const packageOrder = await packageFactory.makeDbPackage({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    const packageId = packageOrder.id.toString()
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: courier.role,
    })
    const response = await request(app.getHttpServer())
      .patch(`/packages/${packageId}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: photo.id.toString(),
      })

    const packageInDb = await db.package.findFirst()
    expect(response.status).toBe(204)
    expect(packageInDb).toEqual(
      expect.objectContaining({
        deliveredAt: expect.any(Date),
      }),
    )
  })
})
