import { CreateCourierUseCase } from '@/domain/operations/application/use-cases/create-courier'
import { CreatePackageUseCase } from '@/domain/operations/application/use-cases/create-package'
import { CreateRecipientUseCase } from '@/domain/operations/application/use-cases/create-recipient'
import { DeleteCourierUseCase } from '@/domain/operations/application/use-cases/delete-courier'
import { DeletePackageUseCase } from '@/domain/operations/application/use-cases/delete-package'
import { DeleteRecipientUseCase } from '@/domain/operations/application/use-cases/delete-recipient'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CreateCourierController } from './create-courier-controller'
import { CreatePackageController } from './create-package-controller'
import { CreateRecipientController } from './create-recipient-controller'
import { DeleteCourierController } from './delete-courier-controller'
import { DeletePackageController } from './delete-package-controller'
import { DeleteRecipientController } from './delete-recipient-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateCourierController,
    CreatePackageController,
    CreateRecipientController,
    DeleteCourierController,
    DeletePackageController,
    DeleteRecipientController,
  ],
  providers: [
    CreateCourierUseCase,
    CreatePackageUseCase,
    CreateRecipientUseCase,
    DeleteCourierUseCase,
    DeletePackageUseCase,
    DeleteRecipientUseCase,
  ],
})
export class OperationsControllersModule {}