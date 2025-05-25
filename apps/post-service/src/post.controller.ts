import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostService } from './post.service';

export interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern('post.create')
  async createPost(@Payload() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @MessagePattern('post.findAll')
  async findAllPosts(@Payload() data: { page?: number; limit?: number }) {
    return this.postService.findAll(data.page, data.limit);
  }

  @MessagePattern('post.findOne')
  async findOnePost(@Payload() id: number) {
    return this.postService.findOne(id);
  }

  @MessagePattern('post.findByUser')
  async findPostsByUser(@Payload() userId: number) {
    return this.postService.findByUserId(userId);
  }

  @MessagePattern('post.update')
  async updatePost(
    @Payload()
    data: {
      id: number;
      updatePostDto: UpdatePostDto;
      userId: number;
    },
  ) {
    return this.postService.update(data.id, data.updatePostDto, data.userId);
  }

  @MessagePattern('post.remove')
  async removePost(@Payload() data: { id: number; userId: number }) {
    return this.postService.remove(data.id, data.userId);
  }
}
