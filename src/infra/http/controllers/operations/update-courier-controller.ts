import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { UpdateCourierUseCase } from '@/domain/operations/application/use-cases/update-courier'
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

const updateCourierBodySchema = z.object({
  name: z.string(),
})

type TupdateCourier = z.infer<typeof updateCourierBodySchema>

@Controller('/couriers/:courierId')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateCourierController {
  constructor(private updateCourier: UpdateCourierUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('courierId') courierId: string,
    @Body(new ZodValidationPipe(updateCourierBodySchema)) body: TupdateCourier,
  ) {
    const { name } = body
    const result = await this.updateCourier.execute({
      courierId,
      name,
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
