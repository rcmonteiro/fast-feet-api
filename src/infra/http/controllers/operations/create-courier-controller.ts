import { UserAlreadyExistsError } from '@/domain/auth/application/use-cases/errors/user-already-exists-error'
import { CreateCourierUseCase } from '@/domain/operations/application/use-cases/create-courier'
import { Admin } from '@/infra/auth/admin'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const createCourierBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string().min(6),
})

type TCreateCourier = z.infer<typeof createCourierBodySchema>

@Controller('/couriers')
@Admin()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateCourierController {
  constructor(private createCourier: CreateCourierUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createCourierBodySchema)) body: TCreateCourier,
  ) {
    const { name, email, cpf, password } = body
    const result = await this.createCourier.execute({
      name,
      email,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
