import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { PackageFactory } from 'test/factories/make-package'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Packages (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PackageFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)

    await app.init()
  })

  test('[GET] /packages', async () => {
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const recipient = await recipientFactory.makeDbRecipient()
    await Promise.all([
      packageFactory.makeDbPackage({ recipientId: recipient.id }),
      packageFactory.makeDbPackage({ recipientId: recipient.id }),
      packageFactory.makeDbPackage({ recipientId: recipient.id }),
      packageFactory.makeDbPackage({ recipientId: recipient.id }),
      packageFactory.makeDbPackage({ recipientId: recipient.id }),
    ])

    const response = await request(app.getHttpServer())
      .get('/packages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.packages).toHaveLength(5)
  })
})
