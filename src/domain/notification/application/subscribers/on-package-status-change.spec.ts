import { makePackage } from 'test/factories/make-package'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryPackagesRepository } from 'test/repositories/in-memory-packages-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnPackageStatusChange } from './on-package-status-change'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let inMemoryPackagesRepository: InMemoryPackagesRepository

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Package Status Change', () => {
  beforeEach(() => {
    inMemoryPackagesRepository = new InMemoryPackagesRepository()
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )
    sendNotificationSpy = vi.spyOn(sendNotification, 'execute')
    new OnPackageStatusChange(sendNotification)
  })

  it('should send a notification when a package is collected', async () => {
    const recipient = makeRecipient()
    const packageOrder = makePackage({
      recipientId: recipient.id,
    })
    inMemoryPackagesRepository.create(packageOrder)
    packageOrder.collectedAt = new Date()
    inMemoryPackagesRepository.save(packageOrder)
    waitFor(() => expect(sendNotificationSpy).toHaveBeenCalledTimes(1))
  })

  it('should send a notification when a package is delivered', async () => {
    const recipient = makeRecipient()
    const packageOrder = makePackage({
      recipientId: recipient.id,
    })
    inMemoryPackagesRepository.create(packageOrder)
    packageOrder.deliveredAt = new Date()
    inMemoryPackagesRepository.save(packageOrder)
    waitFor(() => expect(sendNotificationSpy).toHaveBeenCalledTimes(1))
  })
})
