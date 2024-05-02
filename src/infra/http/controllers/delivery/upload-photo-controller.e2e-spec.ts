import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('Upload Photo (e2e)', () => {
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

  test('[POST] /photos', async () => {
    const courier = await courierFactory.makeDbCourier()

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const response = await request(app.getHttpServer())
      .post('/photos')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/image-sample.jpg')

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        photoId: expect.any(String),
      }),
    )
  })
})
