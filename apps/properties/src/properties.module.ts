import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Property, PropertySchema } from './schemas/property.schema';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { PropertiesMessageController } from './properties.message';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema }]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'users_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [PropertiesController, PropertiesMessageController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
