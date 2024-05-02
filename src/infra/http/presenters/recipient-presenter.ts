import { Recipient } from '@/domain/operations/enterprise/entities/recipient'

export abstract class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      city: recipient.city,
      state: recipient.state,
      postalCode: recipient.postalCode,
      address: recipient.address,
      number: recipient.number,
      complement: recipient.complement,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
