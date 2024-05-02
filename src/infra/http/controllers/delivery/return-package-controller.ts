import { NotAllowedError } from '@/core/error/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { ReturnPackageUseCase } from '@/domain/delivery/application/use-cases/return-package'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { TTokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'

@Controller('/packages/:packageId/return')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnPackageController {
  constructor(private returnPackage: ReturnPackageUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('packageId') packageId: string,
    @CurrentUser() user: TTokenPayload,
  ) {
    const courierId = user.sub
    const result = await this.returnPackage.execute({
      packageId,
      courierId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
