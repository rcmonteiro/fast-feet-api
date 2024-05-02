import { OnPackageStatusChange } from '@/domain/notification/application/subscribers/on-package-status-change'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [SendNotificationUseCase, OnPackageStatusChange],
})
export class EventsModule {}
