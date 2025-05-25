import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.controller';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PostService {
  private posts: Post[] = [];
  private nextId = 1;

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost: Post = {
      id: this.nextId++,
      title: createPostDto.title,
      content: createPostDto.content,
      userId: createPostDto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.push(newPost);
    return newPost;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const sortedPosts = this.posts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      total: this.posts.length,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Post | null> {
    return this.posts.find((post) => post.id === id) || null;
  }

  async findByUserId(userId: number): Promise<Post[]> {
    return this.posts
      .filter((post) => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post | null> {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return null;
    }

    const post = this.posts[postIndex];

    // 작성자만 수정 가능
    if (post.userId !== userId) {
      throw new Error('Not authorized to update this post');
    }

    if (updatePostDto.title !== undefined) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.content !== undefined) {
      post.content = updatePostDto.content;
    }

    post.updatedAt = new Date();
    this.posts[postIndex] = post;

    return post;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return false;
    }

    const post = this.posts[postIndex];

    // 작성자만 삭제 가능
    if (post.userId !== userId) {
      throw new Error('Not authorized to delete this post');
    }

    this.posts.splice(postIndex, 1);
    return true;
  }
}
