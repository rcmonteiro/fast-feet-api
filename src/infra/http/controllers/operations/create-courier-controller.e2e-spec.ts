import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'

describe('Create Courier (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /couriers', async () => {
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .post('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        cpf: '12345678974',
        password: '123456',
      })

    expect(response.status).toBe(201)
  })
})
