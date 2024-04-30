import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
} from '@/domain/auth/enterprise/entities/courier'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makeCourier = (
  override: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) => {
  const newCourier = Courier.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'COURIER',
      ...override,
    },
    id,
  )
  return newCourier
}

@Injectable()
export class CourierFactory {
  constructor(private db: PrismaService) {}

  async makeDbCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data)

    const courierData = PrismaCourierMapper.toPrisma(courier)

    await this.db.user.create({ data: { role: 'COURIER', ...courierData } })

    return courier
  }
}
