import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { UpdateRecipientUseCase } from '@/domain/operations/application/use-cases/update-recipient'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const updateRecipientBodySchema = z.object({
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

type TupdateRecipient = z.infer<typeof updateRecipientBodySchema>

@Controller('/recipients/:recipientId')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateRecipientController {
  constructor(private updateRecipient: UpdateRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('recipientId') recipientId: string,
    @Body(new ZodValidationPipe(updateRecipientBodySchema))
    body: TupdateRecipient,
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
    const result = await this.updateRecipient.execute({
      recipientId,
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
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
