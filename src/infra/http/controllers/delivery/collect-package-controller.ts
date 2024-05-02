import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error'
import { CollectPackageUseCase } from '@/domain/delivery/application/use-cases/collect-package'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { TTokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'

@Controller('/packages/:packageId/collect')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CollectPackageController {
  constructor(private collectPackage: CollectPackageUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('packageId') packageId: string,
    @CurrentUser() user: TTokenPayload,
  ) {
    const courierId = user.sub
    const result = await this.collectPackage.execute({
      packageId,
      courierId,
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
