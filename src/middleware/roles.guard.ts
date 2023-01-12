import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDto } from 'src/dto/user.dto';
import { ROLES_KEY } from 'src/security/roles.decorator';
import { Role } from 'src/security/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if method has @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If not, pass through
    if (!requiredRoles) {
      return true;
    }

    // Method requires roles, check if session exists
    const user = context.switchToHttp().getRequest().session.user as UserDto;
    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if user has required roles
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
