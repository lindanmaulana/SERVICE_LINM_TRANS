import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RoleAllowedGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.get(Roles, context.getHandler());
		if (!requiredRoles) return true;

		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as unknown as JwtPayload;

		if (!user || !user.role)
			throw new ForbiddenException(
				'Access denied, You do not have the required permission to perform this action!',
			);

		const havePermission = requiredRoles.includes(user.role);
		if (!havePermission) throw new ForbiddenException('You do not have permission to access this resource!');

		return true;
	}
}
