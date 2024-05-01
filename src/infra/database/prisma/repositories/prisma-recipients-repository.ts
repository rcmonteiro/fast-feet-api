import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/operations/application/repositories/recipients-repository'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  private readonly PAGE_SIZE = 20

  constructor(private db: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.db.recipient.findUnique({
      where: { id },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = await this.db.recipient.findMany({
      take: this.PAGE_SIZE,
      skip: (page - 1) * this.PAGE_SIZE,
    })

    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.db.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.db.recipient.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.db.recipient.delete({
      where: {
        id: recipient.id.toString(),
      },
    })
  }
}
