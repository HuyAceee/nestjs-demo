/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  description: string;
  content: string;
  user: string;
  categories: [string];
}

export class UpdatePostDto {
  @IsNotEmpty()
  id: string;
  content: string;
  @IsNotEmpty()
  title: string;
}

export class PaginationPostDto {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  start: string;
}

export class GetPostsByCategoryBodyDto {
  @IsNotEmpty()
  categoryId: string;
}

export class GetPostsByCategoriesBodyDto {
  categories: [string];
}
