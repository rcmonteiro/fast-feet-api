import { CreateRecipientUseCase } from '@/domain/operations/application/use-cases/create-recipient'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const createRecipientBodySchema = z.object({
  name: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  address: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
})

type TCreateRecipient = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createRecipientBodySchema))
    body: TCreateRecipient,
  ) {
    const {
      name,
      city,
      state,
      postalCode,
      address,
      number,
      complement,
      latitude,
      longitude,
    } = body
    const result = await this.createRecipient.execute({
      name,
      city,
      state,
      postalCode,
      address,
      number,
      complement,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
