/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { MailerService } from '@nest-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  async getAllUser() {
    return this.userRepository.findAll();
  }

  async createUser(user: CreateUserDto) {
    user.password = await bcrypt.hash(user.password, 10);

    const userInfo = await this.userRepository.findByCondition({
      email: user.email,
    });
    if (userInfo) {
      console.log(userInfo);
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to my website',
      template: './createUser',
      context: {
        name: user.name,
      },
    });
    return this.userRepository.create(user);
  }

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByCondition({
      email,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const is_equal = bcrypt.compareSync(password, user.password);
    if (!is_equal) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByCondition({
      email,
    });
  }

  async update(filter, update) {
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        10,
      );
    }
    return await this.userRepository.findByConditionAndUpdate(filter, {
      refreshToken: update.refreshToken,
    });
  }

  async findUserByRefresh(refreshToken, email) {
    const user = await this.userRepository.findByCondition({ email });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      this.reverse(refreshToken),
      user.refreshToken,
    );
    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private reverse(s: string) {
    return s.split('').reverse().join('');
  }
}
