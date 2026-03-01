import { LIBRARY_TOKENS, REPOSITORY_TOKENS } from '@/common/const/token.const';
import { UserRole } from '@/common/const/user-role.const';
import type { UserRepository } from '@/modules/master-data/users/domain/repositories/user.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { OauthGoogleSigninDto, OauthGoogleSigninResponseDto } from '@/modules/identity/auth/dto/oauth-signin.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersSharedService } from '@/modules/master-data/users/users-shared.service';
import { AuthhSignUpDto, AuthhSignUpResponseDto } from './dto/auth-signup.dto';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { UserStatus } from '@/common/const/user.const';
import { OtpsSharedService } from '../otps/otps-shared.service';
import { OtpsService } from '../otps/otps.service';

@Injectable()
export class AuthService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		private otpService: OtpsService,
		private userSharedService: UsersSharedService,
		private jwtService: JwtService,
	) {}

	async signUp(dto: AuthhSignUpDto): Promise<AuthhSignUpResponseDto> {
		const userEntity = await this.userRepository.findByEmail(dto.email);
		if (userEntity) {
			throw new BadRequestException('Email telah di gunakan!');
		}

		const hashPassword = await this.libHash.hash(dto.password, 8);

		const record = User.create({
			email: dto.email,
			password: hashPassword,
			name: dto.name,
			role: UserRole.CUSTOMER,
			provider: 'local',
			providerId: null,
			avatar: null,
			status: UserStatus.PENDING,
		});

		const result = await this.userRepository.create(record);
		await this.otpService.requestRegisterOtp({
			to: dto.email,
			userId: result.id,
		});

		return AuthResponseMapper.toAuthSignUp(result);
	}

	async signInGoogle(dto: OauthGoogleSigninDto): Promise<OauthGoogleSigninResponseDto> {
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
				status: UserStatus.ACTIVE,
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
