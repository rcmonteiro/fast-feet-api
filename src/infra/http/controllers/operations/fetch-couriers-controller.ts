import { FetchCouriersUseCase } from '@/domain/operations/application/use-cases/fetch-couriers'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CourierPresenter } from '../../presenters/courier-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchCourierController {
  constructor(private fetchCouriers: FetchCouriersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchCouriers.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const couriers = result.value.couriers

    return { couriers: couriers.map(CourierPresenter.toHTTP) }
  }
}
