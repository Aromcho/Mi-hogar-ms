import { Module } from '@nestjs/common';
import { MessagingModule } from '../../../libs/messaging/src/messaging.module';
import { UsersController } from './controllers/users.controller';
import { PropertiesController } from './controllers/properties.controller';
import { AutocompleteGatewayController } from './controllers/autocomplete.controller';

@Module({
  imports: [MessagingModule],
  controllers: [UsersController, PropertiesController, AutocompleteGatewayController],
})
export class GatewayModule {}
