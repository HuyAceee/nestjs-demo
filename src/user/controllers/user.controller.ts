/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard())
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('post/all')
  async getPostsUser(@Req() req: any) {
    await req.user.populate('posts').execPopulate();
    return req.user.posts;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllUser() {
    return this.userService.getAllUser();
  }
}
