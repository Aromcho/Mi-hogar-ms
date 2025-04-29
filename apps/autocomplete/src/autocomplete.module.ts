import { Module } from '@nestjs/common';
import { AutocompleteController } from './autocomplete.controller';
import { AutocompleteService } from './autocomplete.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AutocompleteMessageController } from './autocomplete.message';

@Module({
  imports: [
    ClientsModule.register ([
      {
        name: 'AUTOCOMPLETE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'autocomplete_queue',
          queueOptions: { durable: false },
        }
      }
    ])
  ],
  controllers: [AutocompleteController, AutocompleteMessageController],
  providers: [AutocompleteService],
})
export class AutocompleteModule {}
