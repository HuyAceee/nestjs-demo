/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  GetPostsByCategoriesBodyDto,
  GetPostsByCategoryBodyDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostDetail(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createPost(@Body() post: CreatePostDto, @Req() req: any) {
    return this.postService.createPost(req.user._id, post);
  }

  @Patch()
  updatePost(@Body() post: UpdatePostDto) {
    return this.postService.replacePost(post.id, post);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }

  @Post('category')
  getPostsByCategory(@Body() body: GetPostsByCategoryBodyDto) {
    return this.postService.getPostsByCategory(body.categoryId);
  }

  @Post('categories')
  getPostsByCategories(@Body() body: GetPostsByCategoriesBodyDto) {
    return this.postService.getPostsByCategories(body.categories);
  }
}
