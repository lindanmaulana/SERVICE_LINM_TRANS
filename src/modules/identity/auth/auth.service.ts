import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { UserRole } from '@/common/const/user-role.const';
import { UserStatus } from '@/common/const/user.const';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { OauthGoogleSigninDto, OauthGoogleSigninResponseDto } from '@/modules/identity/auth/dto/oauth-signin.dto';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { UsersService } from '@/modules/master-data/users/users.service';
import {
	Inject,
	Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OtpsService } from '../otps/otps.service';
import { AuthhSignUpDto, AuthhSignUpResponseDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		private userService: UsersService,
		private otpService: OtpsService,
		private jwtService: JwtService,
	) {}

	async signUp(dto: AuthhSignUpDto): Promise<AuthhSignUpResponseDto> {
		const record = User.create({
			email: dto.email,
			password: dto.password,
			name: dto.name,
			role: UserRole.CUSTOMER,
			provider: 'local',
			providerId: null,
			avatar: null,
			status: UserStatus.PENDING,
		});

		const result = await this.userService.create(record);
		await this.otpService.requestRegisterOtp({
			to: dto.email,
			userId: result.id,
		});

		return AuthResponseMapper.toAuthSignUp(result);
	}

	async signInGoogle(dto: OauthGoogleSigninDto): Promise<OauthGoogleSigninResponseDto> {
		const userEntity = await this.userService.findOneByEmail(dto.email);

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

			const result = await this.userService.create(record);

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

	async sendOtp() {}
}
