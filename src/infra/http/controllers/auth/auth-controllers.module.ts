import { AuthenticateAdminUseCase } from '@/domain/auth/application/use-cases/authenticate-admin'
import { AuthenticateCourierUseCase } from '@/domain/auth/application/use-cases/authenticate-courier'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { AuthenticateAdmin } from './authenticate-admin-controller'
import { AuthenticateCourier } from './authenticate-courier-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [AuthenticateCourier, AuthenticateAdmin],
  providers: [AuthenticateCourierUseCase, AuthenticateAdminUseCase],
})
export class AuthControllersModule {}
