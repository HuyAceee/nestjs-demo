import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy,
  ) {}

  @Get()
  async getAllSubscriber() {
    return this.subscriberService.send(
      {
        cmd: 'get-all-subscriber',
      },
      {},
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriber(@Req() req) {
    console.log(this.subscriberService);
    return this.subscriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }

  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  async createEventSubscriber(@Req() req) {
    this.subscriberService.emit(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
    return true;
  }
}
