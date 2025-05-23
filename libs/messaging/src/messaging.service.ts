import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  private clients: Record<string, ClientProxy> = {};

  constructor() {
    this.clients['users'] = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'users_queue',
        queueOptions: { durable: false },
      },
    });

    this.clients['properties'] = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'properties_queue',
        queueOptions: { durable: false },
      },
    });

    this.clients['autocomplete'] = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'autocomplete_queue',
        queueOptions: { durable: false },
      },
    });

    this.clients['auth'] = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
    });
    this.clients['agencies'] = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'agencies_queue',
        queueOptions: { durable: false },
      },
    });
  }

  

  async sendMessage(service: 'users' | 'properties' | 'autocomplete' | 'auth' | 'agencies', pattern: any, data: any) {
    const client = this.clients[service];
    if (!client) {
      throw new Error(`Service ${service} not found`);
    }
    return client.send(pattern, data).toPromise();
  }
}
