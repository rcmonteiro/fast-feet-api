import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { PackageFactory } from 'test/factories/make-package'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Collect Package (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let db: PrismaService
  let packageFactory: PackageFactory
  let recipientFactory: RecipientFactory
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PackageFactory, RecipientFactory, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    db = moduleRef.get(PrismaService)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[PATCH] /packages/:packageId/collect', async () => {
    const courier = await courierFactory.makeDbCourier()
    const recipient = await recipientFactory.makeDbRecipient()
    const packageOrder = await packageFactory.makeDbPackage({
      recipientId: recipient.id,
    })
    const packageId = packageOrder.id.toString()
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: courier.role,
    })
    const response = await request(app.getHttpServer())
      .patch(`/packages/${packageId}/collect`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const packageInDb = await db.package.findFirst()
    expect(response.status).toBe(204)
    expect(packageInDb).toEqual(
      expect.objectContaining({
        courierId: courier.id.toString(),
        collectedAt: expect.any(Date),
      }),
    )
  })
})
