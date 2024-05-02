import { FetchPackagesUseCase } from '@/domain/operations/application/use-cases/fetch-packages'
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
import { PackagePresenter } from '../../presenters/package-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers/:courierId/packages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchPackageController {
  constructor(private fetchPackages: FetchPackagesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchPackages.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const packages = result.value.packages

    return { packages: packages.map(PackagePresenter.toHTTP) }
  }
}
