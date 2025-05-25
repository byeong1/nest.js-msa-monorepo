import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.send('user.create', createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.send('auth.login', loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.send('user.findOne', req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.send('user.update', {
      id: req.user.sub,
      updateUserDto,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('profile')
  async deleteProfile(@Request() req) {
    return this.userService.send('user.remove', req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.send('user.findOne', +id);
  }
}
