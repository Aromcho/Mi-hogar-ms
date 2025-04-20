import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'users_queue',
        queueOptions: { durable: false },
      },
    });
  }

  // 🔹 Método para enviar mensajes a otros microservicios
  async sendMessage(pattern: any, data: any) {
    return this.client.send(pattern, data).toPromise();
  }
}
