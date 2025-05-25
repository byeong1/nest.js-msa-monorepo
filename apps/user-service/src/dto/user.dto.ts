export class CreateUserDto {
  userName: string;
  password: string;
}

export class LoginDto {
  userName: string;
  password: string;
}

export class UpdateUserDto {
  userName?: string;
  password?: string;
}
