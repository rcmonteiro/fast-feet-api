import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('Delete Courier (e2e)', () => {
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

  test('[DELETE] /couriers/:courierId', async () => {
    const admin = makeAdmin()
    const courier = await courierFactory.makeDbCourier()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .delete(`/couriers/${courier.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(204)
  })
})
