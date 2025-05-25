import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    return this.userService.send('auth.validateToken', token).pipe(
      map((user) => {
        if (user) {
          request.user = user;
          return true;
        }
        throw new UnauthorizedException('Invalid token');
      }),
      catchError(() => {
        throw new UnauthorizedException('Invalid token');
      }),
    );
  }
}
