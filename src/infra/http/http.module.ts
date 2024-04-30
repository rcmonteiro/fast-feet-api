import { AuthenticateCourierUseCase } from '@/domain/auth/application/use-cases/authenticate-courier'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateCourier } from './controllers/authenticate-courier-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [AuthenticateCourier],
  providers: [AuthenticateCourierUseCase],
})
export class HttpModule {}
