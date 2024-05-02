import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('Fetch Couriers (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[GET] /couriers', async () => {
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await Promise.all([
      courierFactory.makeDbCourier(),
      courierFactory.makeDbCourier(),
      courierFactory.makeDbCourier(),
      courierFactory.makeDbCourier(),
      courierFactory.makeDbCourier(),
    ])

    const response = await request(app.getHttpServer())
      .get('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.couriers).toHaveLength(5)
  })
})
