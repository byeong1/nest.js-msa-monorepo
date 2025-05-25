import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Controller('posts')
export class PostController {
  constructor(
    @Inject('POST_SERVICE') private readonly postService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.send('post.create', {
      ...createPostDto,
      userId: req.user.sub,
    });
  }

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.postService.send('post.findAll', {
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.send('post.findOne', +id);
  }

  @UseGuards(AuthGuard)
  @Get('user/my')
  async findMyPosts(@Request() req) {
    return this.postService.send('post.findByUser', req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.send('post.update', {
      id: +id,
      updatePostDto,
      userId: req.user.sub,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.postService.send('post.remove', {
      id: +id,
      userId: req.user.sub,
    });
  }
}
