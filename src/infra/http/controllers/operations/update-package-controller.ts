import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { UpdatePackageUseCase } from '@/domain/operations/application/use-cases/update-package'
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

const updatePackageBodySchema = z.object({
  name: z.string(),
  recipientId: z.string().uuid(),
})

type TupdatePackage = z.infer<typeof updatePackageBodySchema>

@Controller('/packages/:packageId')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdatePackageController {
  constructor(private updatePackage: UpdatePackageUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('packageId') packageId: string,
    @Body(new ZodValidationPipe(updatePackageBodySchema)) body: TupdatePackage,
  ) {
    const { name, recipientId } = body
    const result = await this.updatePackage.execute({
      packageId,
      recipientId,
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
