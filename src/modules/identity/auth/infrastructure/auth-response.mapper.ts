import { Injectable } from '@nestjs/common';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { OauthGoogleSigninResponseDto, SignUpResponseDto, SigninResponseDto } from '@/modules/identity/auth/dto';

@Injectable()
export class AuthResponseMapper {
	static base(user: User) {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			provider: user.provider,
			providerId: user.providerId,
			avatar: user.avatar,
			status: user.status,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	static toAuthSignin(user: User, accessToken: string): SigninResponseDto {
		return {
			user: this.base(user),
			access_token: accessToken,
		};
	}

	static toOauthGoogleSignin(user: User, accessToken: string): OauthGoogleSigninResponseDto {
		return {
			user: this.base(user),
			access_token: accessToken,
		};
	}

	static toAuthSignUp(user: User): SignUpResponseDto {
		return this.base(user);
	}

	static toVerifyResetPassword(user: User, resetPasswordToken: string) {
		return {
			user: this.base(user),
			reset_password_token: resetPasswordToken,
		};
	}
}
