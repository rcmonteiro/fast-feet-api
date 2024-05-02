import { DeleteCourierUseCase } from '@/domain/operations/application/use-cases/delete-courier'
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

@Controller('/couriers/:courierId')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteCourierController {
  constructor(private deleteCourier: DeleteCourierUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('courierId') courierId: string) {
    const result = await this.deleteCourier.execute({
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
