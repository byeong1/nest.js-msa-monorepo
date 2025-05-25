import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

export interface CreateUserDto {
  userName: string;
  password: string;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface UpdateUserDto {
  userName?: string;
  password?: string;
}

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('user.create')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('user.findOne')
  async findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('user.update')
  async updateUser(
    @Payload() data: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return this.userService.update(data.id, data.updateUserDto);
  }

  @MessagePattern('user.remove')
  async removeUser(@Payload() id: number) {
    return this.userService.remove(id);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('auth.validateToken')
  async validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }
}
