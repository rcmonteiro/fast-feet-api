import { Module } from '@nestjs/common'
import { AuthControllersModule } from './controllers/auth/auth-controllers.module'
import { OperationsControllersModule } from './controllers/operations/operations-controllers.module'

@Module({
  imports: [AuthControllersModule, OperationsControllersModule],
})
export class HttpModule {}
