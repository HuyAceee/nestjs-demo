import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CategoryRepository } from 'src/post/repositories/category.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllPosts() {
    return this.postRepository.getByCondition({});
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post
        .populate({
          path: 'user',
          select: '-password',
        })
        .execPopulate();
      return post;
    }
    return new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(userId: string, data: CreatePostDto) {
    data.user = userId;
    const new_data = await this.postRepository.create(data);
    if (data.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: data.categories },
        },
        {
          $push: {
            posts: new_data._id,
          },
        },
      );
    }
    return new_data;
  }

  async replacePost(id: string, data: UpdatePostDto) {
    return this.postRepository.findByIdAndUpdate(id, data);
  }

  async deletePost(id: string) {
    return this.postRepository.deleteOne(id);
  }
}
