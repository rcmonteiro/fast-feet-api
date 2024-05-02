import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { UpdateCourierPasswordUseCase } from '@/domain/operations/application/use-cases/update-courier-password'
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

const updateCourierPasswordBodySchema = z.object({
  password: z.string().min(3),
})

type TupdateCourierPassword = z.infer<typeof updateCourierPasswordBodySchema>

@Controller('/couriers/:courierId/password')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateCourierPasswordController {
  constructor(private updateCourierPassword: UpdateCourierPasswordUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('courierId') courierId: string,
    @Body(new ZodValidationPipe(updateCourierPasswordBodySchema))
    body: TupdateCourierPassword,
  ) {
    const { password } = body
    const result = await this.updateCourierPassword.execute({
      courierId,
      password,
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
