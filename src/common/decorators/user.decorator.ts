import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
	const req: Request = ctx.switchToHttp().getRequest();
	const user = req.user;

	if (!user) return null;
	if (data && data in user) return user[data as keyof typeof user];

	return user;
});
