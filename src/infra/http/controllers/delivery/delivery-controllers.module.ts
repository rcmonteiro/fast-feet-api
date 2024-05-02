import { CollectPackageUseCase } from '@/domain/delivery/application/use-cases/collect-package'
import { DeliverPackageUseCase } from '@/domain/delivery/application/use-cases/deliver-package'
import { ReturnPackageUseCase } from '@/domain/delivery/application/use-cases/return-package'
import { UploadPhotoUseCase } from '@/domain/delivery/application/use-cases/upload-photo'
import { FetchPackagesUseCase } from '@/domain/operations/application/use-cases/fetch-packages'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CollectPackageController } from './collect-package-controller'
import { DeliverPackageController } from './deliver-package-controller'
import { FetchPackageController } from './fetch-my-packages-controller'
import { ReturnPackageController } from './return-package-controller'
import { UploadPhotoController } from './upload-photo-controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CollectPackageController,
    DeliverPackageController,
    ReturnPackageController,
    FetchPackageController,
    UploadPhotoController,
  ],
  providers: [
    CollectPackageUseCase,
    DeliverPackageUseCase,
    ReturnPackageUseCase,
    FetchPackagesUseCase,
    UploadPhotoUseCase,
  ],
})
export class DeliveryControllersModule {}
