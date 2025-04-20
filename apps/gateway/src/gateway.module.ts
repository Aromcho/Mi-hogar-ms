import { Module } from '@nestjs/common';
import { MessagingModule } from '../../../libs/messaging/src/messaging.module';
import { UsersController } from './controllers/users.controller';
import { PropertiesController } from './controllers/properties.controller';

@Module({
  imports: [MessagingModule],
  controllers: [UsersController, PropertiesController],
})
export class GatewayModule {}
