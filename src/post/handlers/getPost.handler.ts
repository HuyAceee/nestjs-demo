/* eslint-disable prettier/prettier */
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';
import { GetPostQuery } from '../queries/getPost.query';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements ICommandHandler<GetPostQuery> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostQuery): Promise<any> {
    return this.postRepository.findById(query.postId);
  }
}
