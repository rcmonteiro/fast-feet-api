import { CreateCourierUseCase } from '@/domain/operations/application/use-cases/create-courier'
import { CreatePackageUseCase } from '@/domain/operations/application/use-cases/create-package'
import { CreateRecipientUseCase } from '@/domain/operations/application/use-cases/create-recipient'
import { DeleteCourierUseCase } from '@/domain/operations/application/use-cases/delete-courier'
import { DeletePackageUseCase } from '@/domain/operations/application/use-cases/delete-package'
import { DeleteRecipientUseCase } from '@/domain/operations/application/use-cases/delete-recipient'
import { FetchCouriersUseCase } from '@/domain/operations/application/use-cases/fetch-couriers'
import { FetchPackagesUseCase } from '@/domain/operations/application/use-cases/fetch-packages'
import { FetchRecipientsUseCase } from '@/domain/operations/application/use-cases/fetch-recipients'
import { UpdateCourierUseCase } from '@/domain/operations/application/use-cases/update-courier'
import { UpdateCourierPasswordUseCase } from '@/domain/operations/application/use-cases/update-courier-password'
import { UpdatePackageUseCase } from '@/domain/operations/application/use-cases/update-package'
import { UpdateRecipientUseCase } from '@/domain/operations/application/use-cases/update-recipient'
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
import { FetchCourierController } from './fetch-couriers-controller'
import { FetchPackageController } from './fetch-packages-controller'
import { FetchRecipientController } from './fetch-recipients-controller'
import { UpdateCourierController } from './update-courier-controller'
import { UpdateCourierPasswordController } from './update-courier-password-controller'
import { UpdatePackageController } from './update-package-controller'
import { UpdateRecipientController } from './update-recipient-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateCourierController,
    CreatePackageController,
    CreateRecipientController,
    DeleteCourierController,
    DeletePackageController,
    DeleteRecipientController,
    FetchCourierController,
    FetchPackageController,
    FetchRecipientController,
    UpdateCourierController,
    UpdatePackageController,
    UpdateRecipientController,
    UpdateCourierPasswordController,
  ],
  providers: [
    CreateCourierUseCase,
    CreatePackageUseCase,
    CreateRecipientUseCase,
    DeleteCourierUseCase,
    DeletePackageUseCase,
    DeleteRecipientUseCase,
    FetchCouriersUseCase,
    FetchPackagesUseCase,
    FetchRecipientsUseCase,
    UpdateCourierUseCase,
    UpdatePackageUseCase,
    UpdateRecipientUseCase,
    UpdateCourierPasswordUseCase,
  ],
})
export class OperationsControllersModule {}
