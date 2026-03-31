import { Injectable } from '@nestjs/common';
import { OauthGoogleSigninDto, OauthGoogleSigninResponseDto } from '@/modules/identity/auth/dto';
import { UsersService } from '@/modules/master-data/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { UserRole } from '@/common/const/user-role.const';
import { UserStatus } from '@/common/const/user.const';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { JwtTypeToken } from '@/common/const/jwt-token-type.const';

@Injectable()
export class SigninGoogleService {
	protected logCtx = this.constructor.name;

	constructor(
		private readonly userService: UsersService,
		private jwtService: JwtService,
	) {}

	async execute(dto: OauthGoogleSigninDto): Promise<OauthGoogleSigninResponseDto> {
		const userEntity = await this.userService.findEntityByEmail(dto.email);

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

			const payloadToken: JwtPayload = {
				id: result.id,
				email: result.email,
				role: result.role,
				name: result.name ?? 'User',
				status: result.status,
				type: JwtTypeToken.ACCESS_TOKEN,
			};

			const accessToken = this.jwtService.sign(payloadToken);

			return AuthResponseMapper.toOauthGoogleSignin(result, accessToken);
		}

		const payloadToken: JwtPayload = {
			id: userEntity.id,
			email: userEntity.email,
			role: userEntity.role,
			name: userEntity.name ?? 'User',
			status: userEntity.status,
			type: JwtTypeToken.ACCESS_TOKEN,
		};

		const accessToken = this.jwtService.sign(payloadToken);

		return AuthResponseMapper.toOauthGoogleSignin(userEntity, accessToken);
	}
}
