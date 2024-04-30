import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('Authenticate Courier (e2e)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await courierFactory.makeDbCourier({
      email: 'john.doe@me.com',
      password: await hash('123456', 8),
    })

    console.log(await hash('123456', 8))

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@me.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
