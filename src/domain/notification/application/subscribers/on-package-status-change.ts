import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { PackageStatusChangeEvent } from '@/domain/delivery/enterprise/events/package-status-change-event'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnPackageStatusChange implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPackageStatusChangeNotification.bind(this),
      PackageStatusChangeEvent.name,
    )
  }

  private async sendPackageStatusChangeNotification({
    packageOrder,
    status,
  }: PackageStatusChangeEvent) {
    if (packageOrder) {
      await this.sendNotification.execute({
        recipientId: packageOrder.recipientId.toString(),
        title: `Sua encomenda "${packageOrder.name}" mudou de status`,
        content: `Todo... ${status}...`,
      })
    }
  }
}
