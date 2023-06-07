/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { Post } from 'src/post/models/post.model';

export class CreateCategoryDto {
  @IsNotEmpty()
  title: string;
  posts: [Post];
}
