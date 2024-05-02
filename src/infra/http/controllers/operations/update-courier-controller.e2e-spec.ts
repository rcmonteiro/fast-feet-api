import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('Update Courier (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let db: PrismaService
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    db = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[PUT] /couriers', async () => {
    const courier = await courierFactory.makeDbCourier()
    const courierId = courier.id.toString()
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .put(`/couriers/${courierId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Updated',
      })

    const courierInDb = await db.user.findFirst()
    expect(response.status).toBe(204)
    expect(courierInDb).toEqual(
      expect.objectContaining({
        name: 'John Doe Updated',
      }),
    )
  })
})
