import { AdminsRepository } from '@/domain/auth/application/repositories/admins-repository'
import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PackagesRepository } from '@/domain/operations/application/repositories/packages-repository'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-courier-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaPackagesRepository } from './prisma/repositories/prisma-packages-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: PackagesRepository,
      useClass: PrismaPackagesRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
  ],
  exports: [
    PrismaService,
    NotificationsRepository,
    CouriersRepository,
    PackagesRepository,
    RecipientsRepository,
    AdminsRepository,
  ],
})
export class DatabaseModule {}
