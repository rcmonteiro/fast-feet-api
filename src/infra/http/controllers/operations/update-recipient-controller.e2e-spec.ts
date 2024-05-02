import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Update Recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let db: PrismaService
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    db = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[PUT] /recipients/:recipientId', async () => {
    const recipient = await recipientFactory.makeDbRecipient()
    const recipientId = recipient.id.toString()
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Updated',
        city: recipient.city,
        state: recipient.state,
        postalCode: recipient.postalCode,
        address: recipient.address,
        number: recipient.number,
        complement: recipient.complement,
        latitude: recipient.latitude,
        longitude: recipient.longitude,
      })

    const recipientInDb = await db.recipient.findFirst()
    expect(response.status).toBe(204)
    expect(recipientInDb).toEqual(
      expect.objectContaining({
        name: 'John Doe Updated',
      }),
    )
  })
})
