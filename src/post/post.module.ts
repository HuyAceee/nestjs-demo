import { CacheModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controllers/category.controller';
import { PostController } from './controllers/post.controller';
import { CreatePostHandler } from './handlers/createPost.handler';
import { CategorySchema } from './models/category.model';
import { PostSchema } from './models/post.model';
import { CategoryRepository } from './repositories/category.repository';
import { PostRepository } from './repositories/post.repository';
import { CategoryService } from './services/category.service';
import { PostService } from './services/post.service';
import { GetPostHandler } from './handlers/getPost.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
    CqrsModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<string>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryService,
    CategoryRepository,
    CreatePostHandler,
    GetPostHandler,
  ],
})
export class PostModule {}
