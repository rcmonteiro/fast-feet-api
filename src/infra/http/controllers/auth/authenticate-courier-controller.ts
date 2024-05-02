import { AuthenticateCourierUseCase } from '@/domain/auth/application/use-cases/authenticate-courier'
import { WrongCredentialsError } from '@/domain/auth/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

type TAuthenticate = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateCourier {
  constructor(private authenticateCourier: AuthenticateCourierUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: TAuthenticate) {
    const { cpf, password } = body
    const result = await this.authenticateCourier.execute({
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
