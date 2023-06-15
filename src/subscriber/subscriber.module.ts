/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  controllers: [SubscriberController],
  providers: [
    SubscriberService,
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBER_SERVICE_HOST'),
            port: configService.get('SUBSCRIBER_SERVICE_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class SubscriberModule {}
