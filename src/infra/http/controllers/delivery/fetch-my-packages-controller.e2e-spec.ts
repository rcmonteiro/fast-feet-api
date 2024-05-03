import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { PackageFactory } from 'test/factories/make-package'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch My Packages (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PackageFactory, RecipientFactory, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[GET] /couriers/:courierId/packages', async () => {
    const courier = await courierFactory.makeDbCourier()
    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const recipient = await recipientFactory.makeDbRecipient({
      latitude: -23.5505199,
      longitude: -46.6333093,
    })
    await Promise.all([
      packageFactory.makeDbPackage({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      packageFactory.makeDbPackage({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      packageFactory.makeDbPackage({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      packageFactory.makeDbPackage({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
      packageFactory.makeDbPackage({
        recipientId: recipient.id,
        courierId: courier.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courier.id}/packages`)
      .query({
        page: 1,
        distance: 10,
        userLatitude: -23.5505199,
        userLongitude: -46.6333093,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.packages).toHaveLength(5)
  })
})
