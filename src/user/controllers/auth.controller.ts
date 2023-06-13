/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  RefreshTokenBodyDto,
} from '../dto/user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  createUser(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenBodyDto) {
    console.log(body);
    return this.authService.refresh(body.refreshToken);
  }
}
