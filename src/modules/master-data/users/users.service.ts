import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from './domain/repositories/user.repository';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UsersSharedService } from './users-shared.service';
import { UserResponseMapper } from './infrastructure/persistance/users-response.mapper';
import { GetOneUserResponseDto } from './dto/get-one-user.dto';
import { UpdateProfileUserDto, UpdateProfileUserResponseDto } from './dto/update-profile-user.dto';
import { DeleteUserResponseDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		private userSharedService: UsersSharedService,
	) {}

	async findProfile(user: JwtPayload): Promise<GetProfileUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsByEmail(user.email);

		return UserResponseMapper.toGetProfile(userEntity);
	}

	async updateProfile(user: JwtPayload, dto: UpdateProfileUserDto): Promise<UpdateProfileUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsByEmail(user.email);
		userEntity.update({ name: dto.name });

		const result = await this.userRepository.update(userEntity);

		return UserResponseMapper.toGetProfile(result);
	}

	async findOne(id: string): Promise<GetOneUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsById(id);

		return UserResponseMapper.toGetOne(userEntity);
	}

	async delete(userId: string): Promise<DeleteUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsById(userId);

		if (userEntity.deletedAt) throw new BadRequestException('Data user telah di terhapus');
		userEntity.setDeleted();

		await this.userRepository.delete(userEntity);

		return {};
	}
}
