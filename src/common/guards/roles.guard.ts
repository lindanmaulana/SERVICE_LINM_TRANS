import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RoleAccepted } from '../const/user-role.const';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { IsPublic } from '../decorators/is-public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublic, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as unknown as JwtPayload;

		if (!user || !user.role)
			throw new ForbiddenException(
				'Access denied, You do not have the required permission to perform this action!',
			);

		const roleValidated = RoleAccepted.includes(user.role);
		if (!roleValidated) throw new ForbiddenException('You do not have permission to access this resource!');

		return true;
	}
}
