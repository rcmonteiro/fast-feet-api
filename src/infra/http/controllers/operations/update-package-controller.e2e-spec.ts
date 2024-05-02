import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAdmin } from 'test/factories/make-admin'
import { PackageFactory } from 'test/factories/make-package'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Package (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let db: PrismaService
  let packageFactory: PackageFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PackageFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    db = moduleRef.get(PrismaService)
    packageFactory = moduleRef.get(PackageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[PUT] /packages/:packageId', async () => {
    const recipient = await recipientFactory.makeDbRecipient()
    const packageOrder = await packageFactory.makeDbPackage({
      recipientId: recipient.id,
    })
    const packageId = packageOrder.id.toString()
    const admin = makeAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })
    const response = await request(app.getHttpServer())
      .put(`/packages/${packageId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Updated',
        recipientId: recipient.id.toString(),
      })

    const packageInDb = await db.package.findFirst()
    expect(response.status).toBe(204)
    expect(packageInDb).toEqual(
      expect.objectContaining({
        name: 'John Doe Updated',
      }),
    )
  })
})
