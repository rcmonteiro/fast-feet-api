import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreatePackageUseCase } from '@/domain/operations/application/use-cases/create-package'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createPackageBodySchema = z.object({
  name: z.string(),
  recipientId: z.string().uuid(),
})

type TCreatePackage = z.infer<typeof createPackageBodySchema>

@Controller('/packages')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreatePackageController {
  constructor(private createPackage: CreatePackageUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPackageBodySchema))
  async handle(@Body() body: TCreatePackage) {
    const { name, recipientId } = body
    const result = await this.createPackage.execute({
      name,
      recipientId: new UniqueEntityId(recipientId),
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
