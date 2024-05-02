import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { PackageFactory } from 'test/factories/make-package'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

describe('On package status change (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let packageFactory: PackageFactory
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, PackageFactory, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(PackageFactory)
    courierFactory = moduleRef.get(CourierFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when a package is collected', async () => {
    const courier = await courierFactory.makeDbCourier()
    const recipient = await recipientFactory.makeDbRecipient()
    const packageOrder = await packageFactory.makeDbPackage({
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: courier.role,
    })

    await request(app.getHttpServer())
      .patch(`/packages/${packageOrder.id.toString()}/collect`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    await waitFor(async () => {
      const notification = await db.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })
      expect(notification).not.toBeNull()
    })
  })
})
