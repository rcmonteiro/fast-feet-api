import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)
    return recipient ?? null
  }

  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = this.items.slice((page - 1) * 20, page * 20)
    return recipients
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const findIndex = this.items.findIndex((item) =>
      item.id.equals(recipient.id),
    )
    if (findIndex >= 0) {
      this.items[findIndex] = recipient
    }
  }

  async delete(recipient: Recipient): Promise<void> {
    const findIndex = this.items.findIndex((item) =>
      item.id.equals(recipient.id),
    )
    if (findIndex >= 0) {
      this.items.splice(findIndex, 1)
    }
  }
}
