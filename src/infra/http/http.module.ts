import { AuthenticateAdminUseCase } from '@/domain/auth/application/use-cases/authenticate-admin'
import { AuthenticateCourierUseCase } from '@/domain/auth/application/use-cases/authenticate-courier'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdmin } from './controllers/authenticate-admin-controller'
import { AuthenticateCourier } from './controllers/authenticate-courier-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [AuthenticateCourier, AuthenticateAdmin],
  providers: [AuthenticateCourierUseCase, AuthenticateAdminUseCase],
})
export class HttpModule {}
