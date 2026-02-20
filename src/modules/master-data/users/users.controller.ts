import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/const/user-role.const';
import { RoleAllowedGuard } from '@/common/guards/role-allowed.guard';
import { IsPublic } from '@/common/decorators/is-public.decorator';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get('cek-1')
	@IsPublic()
	getUser() {
		return 'hello brader';
	}

	@Get('cek-2')
	@Roles([UserRole.ADMIN])
	@UseGuards(RoleAllowedGuard)
	getUser2() {
		return 'hello brader';
	}

	@Get('me')
	async me() {}
}
