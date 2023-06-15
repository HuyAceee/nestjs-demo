/* eslint-disable prettier/prettier */
import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  GetPostsByCategoriesBodyDto,
  GetPostsByCategoryBodyDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';
import { Cache } from 'cache-manager';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('by-cache')
  @UseInterceptors(CacheInterceptor)
  getAllPostsByCache() {
    return this.postService.getAllPosts();
  }

  @Post('set-cache')
  async demoSetCache() {
    await this.cacheManager.set('newnet', 'hello world', { ttl: 60 * 10 });
    return true;
  }

  @Get('get-cache')
  async demoGetCache() {
    return this.cacheManager.get('newnet');
  }

  @Get(':id')
  getPostDetail(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get('by-command/:id')
  getByCommand(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Get('by-cache/:id')
  getByCache(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createPost(@Body() post: CreatePostDto, @Req() req: any) {
    return this.postService.createPost(req.user._id, post);
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  createPostByCommand(@Body() post: CreatePostDto, @Req() req: any) {
    return this.commandBus.execute(new CreatePostCommand(req.user, post));
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
