import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from './domain/repositories/user.repository.interface';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UsersSharedService } from './users-shared.service';
import { UserResponseMapper } from './infrastructure/persistance/users-response.mapper';

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
}
