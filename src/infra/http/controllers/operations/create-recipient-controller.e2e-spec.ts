import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /recipients', async () => {
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Encomenda do John Doe',
        city: 'Camboriú',
        state: 'SC',
        postalCode: '88348220',
        address: 'Rua de lá',
        number: '1',
        complement: 'apto 0',
        latitude: -26.9977223,
        longitude: -48.6489143,
      })

    expect(response.status).toBe(201)
  })
})
