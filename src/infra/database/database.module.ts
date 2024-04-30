import { CouriersRepository } from '@/domain/auth/application/repositories/couriers-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-courier-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

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
  ],
  exports: [PrismaService, NotificationsRepository, CouriersRepository],
})
export class DatabaseModule {}
