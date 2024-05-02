import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_ADMIN_KEY } from './admin'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!isAdmin) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user && user.role === 'ADMIN') {
      return true
    }

    return false
  }
}
