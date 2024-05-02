import { Module } from '@nestjs/common'
import { AuthControllersModule } from './controllers/auth/auth-controllers.module'
import { DeliveryControllersModule } from './controllers/delivery/delivery-controllers.module'
import { OperationsControllersModule } from './controllers/operations/operations-controllers.module'

@Module({
  imports: [
    AuthControllersModule,
    OperationsControllersModule,
    DeliveryControllersModule,
  ],
})
export class HttpModule {}
