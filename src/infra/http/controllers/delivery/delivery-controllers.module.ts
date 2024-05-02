import { CollectPackageUseCase } from '@/domain/delivery/application/use-cases/collect-package'
import { DeliverPackageUseCase } from '@/domain/delivery/application/use-cases/deliver-package'
import { ReturnPackageUseCase } from '@/domain/delivery/application/use-cases/return-package'
import { FetchPackagesUseCase } from '@/domain/operations/application/use-cases/fetch-packages'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CollectPackageController } from './collect-package-controller'
import { DeliverPackageController } from './deliver-package-controller'
import { FetchPackageController } from './fetch-my-packages-controller'
import { ReturnPackageController } from './return-package-controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CollectPackageController,
    DeliverPackageController,
    ReturnPackageController,
    FetchPackageController,
  ],
  providers: [
    CollectPackageUseCase,
    DeliverPackageUseCase,
    ReturnPackageUseCase,
    FetchPackagesUseCase,
  ],
})
export class DeliveryControllersModule {}
