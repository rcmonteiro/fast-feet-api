import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Delete Recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[DELETE] /recipients/:recipientId', async () => {
    const admin = makeAdmin()
    const recipient = await recipientFactory.makeDbRecipient()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .delete(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(204)
  })
})
