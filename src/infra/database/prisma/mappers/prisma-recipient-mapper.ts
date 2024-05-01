import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/operations/enterprise/entities/recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export abstract class PrismaRecipientMapper {
  public static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        city: raw.city,
        state: raw.state,
        postalCode: raw.postalCode,
        address: raw.address,
        number: raw.number,
        complement: raw.complement,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
      },
      new UniqueEntityId(raw.id),
    )
  }

  public static toPrisma(
    recipient: Recipient,
  ): Prisma.RecipientUncheckedCreateInput {
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
