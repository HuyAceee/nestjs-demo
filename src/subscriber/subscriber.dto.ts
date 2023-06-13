/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateSubscriberBody {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  name: string;
}
