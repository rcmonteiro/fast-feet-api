import { AuthenticateAdminUseCase } from '@/domain/auth/application/use-cases/authenticate-admin'
import { WrongCredentialsError } from '@/domain/auth/application/use-cases/errors/wrong-credentials-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/jwt-roles.guard'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

type TAuthenticate = z.infer<typeof authenticateBodySchema>

@Controller('/admins/sessions')
@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthenticateAdmin {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(authenticateBodySchema)) body: TAuthenticate,
  ) {
    const { cpf, password } = body
    const result = await this.authenticateAdmin.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
