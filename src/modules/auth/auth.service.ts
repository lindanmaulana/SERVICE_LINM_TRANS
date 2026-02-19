import { LIBRARY_TOKENS, REPOSITORY_TOKENS } from '@/common/const/token.const';
import { UserRole } from '@/common/const/user-role.const';
import type { UserRepository } from '@/modules/master-data/users/domain/repositories/user.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../master-data/users/domain/entities/user.entity';
import { OauthGoogleSigninDto, OauthGoogleSigninResponseDto } from './dto/oauth-signin.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseMapper } from '@/modules/auth/infrastructure/auth-response.mapper';
import { UsersSharedService } from '@/modules/master-data/users/users-shared.service';

@Injectable()
export class AuthService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		private userSharedService: UsersSharedService,
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		private jwtService: JwtService,
	) {}

	async signinGoogle(dto: OauthGoogleSigninDto): Promise<OauthGoogleSigninResponseDto> {
		const userEntity = await this.userRepository.findByEmail(dto.email);

		let payloadToken: JwtPayload = { id: '', name: 'User', email: '', role: UserRole.CUSTOMER };
		let accessToken: string = '';

		if (!userEntity) {
			const record = User.create({
				email: dto.email,
				password: null,
				name: dto.name,
				role: UserRole.CUSTOMER,
				provider: dto.provider,
				providerId: dto.providerId,
				avatar: dto.avatar,
			});

			const result = await this.userRepository.create(record);

			payloadToken = {
				id: result.id,
				email: result.email,
				role: result.role,
				name: result.name ?? 'User',
			};

			accessToken = this.jwtService.sign(payloadToken);

			return AuthResponseMapper.toOauthGoogleSignin(result, accessToken);
		}

		payloadToken = {
			id: userEntity.id,
			email: userEntity.email,
			role: userEntity.role,
			name: userEntity.name ?? 'User',
		};

		accessToken = this.jwtService.sign(payloadToken);

		return AuthResponseMapper.toOauthGoogleSignin(userEntity, accessToken);
	}
}
