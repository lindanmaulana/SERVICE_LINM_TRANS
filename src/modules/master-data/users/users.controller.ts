import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/const/user-role.const';
import { RoleAllowedGuard } from '@/common/guards/role-allowed.guard';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { User } from '@/common/decorators/user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { GetOneUserResponseDto } from './dto/get-one-user.dto';
import { UpdateProfileUserDto, UpdateProfileUserResponseDto } from './dto/update-profile-user.dto';
import { DeleteUserResponseDto } from './dto/delete-user.dto';
import { GetAllUserDto, GetAllUserResponseDto } from './dto/get-all.dto';

@Controller({ path: 'users', version: '1' })
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

	@Get('/')
	@ResponseMessage('Users', 'GET')
	@Roles([UserRole.ADMIN])
	@UseGuards(RoleAllowedGuard)
	async getAll(@Query() dto: GetAllUserDto): Promise<GetAllUserResponseDto> {
		return this.userService.findAll(dto)
	}

	@Get('me')
	@ResponseMessage('Profile', 'GET')
	async me(@User() user: JwtPayload): Promise<GetProfileUserResponseDto> {
		return this.userService.findProfile(user);
	}

	@Patch('me')
	@ResponseMessage('Profile', 'UPDATE')
	async meUpdate(@User() user: JwtPayload, @Body() dto: UpdateProfileUserDto): Promise<UpdateProfileUserResponseDto> {
		console.log({ dto, user });
		return this.userService.updateProfile(user, dto);
	}

	@Get(':id')
	@Roles([UserRole.ADMIN])
	@UseGuards(RoleAllowedGuard)
	async getOne(@Param('id') id: string): Promise<GetOneUserResponseDto> {
		return this.userService.findById(id);
	}

	@Delete(':id')
	@Roles([UserRole.ADMIN])
	@UseGuards(RoleAllowedGuard)
	async remove(@Param('id') id: string): Promise<DeleteUserResponseDto> {
		return this.userService.delete(id);
	}
}
