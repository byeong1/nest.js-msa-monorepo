import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './user.controller';

export interface User {
  id: number;
  userName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = this.users.find(
      (user) => user.userName === createUserDto.userName,
    );

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser: User = {
      id: this.nextId++,
      userName: createUserDto.userName,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // 비밀번호를 제외하고 반환
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUserName(userName: string): Promise<User | null> {
    return this.users.find((user) => user.userName === userName) || null;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    const user = this.users[userIndex];

    if (updateUserDto.userName) {
      const existingUser = this.users.find(
        (u) => u.userName === updateUserDto.userName && u.id !== id,
      );
      if (existingUser) {
        throw new Error('Username already exists');
      }
      user.userName = updateUserDto.userName;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    user.updatedAt = new Date();
    this.users[userIndex] = user;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}
