import { DeletePackageUseCase } from '@/domain/operations/application/use-cases/delete-package'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'

@Controller('/packages/:packageId')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeletePackageController {
  constructor(private deletePackage: DeletePackageUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('packageId') packageId: string) {
    const result = await this.deletePackage.execute({
      packageId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
