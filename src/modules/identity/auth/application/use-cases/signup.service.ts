import { UserRole } from '@/common/const/user-role.const';
import { UserStatus } from '@/common/const/user.const';
import { SignUpDto, SignUpResponseDto } from '@/modules/identity/auth/dto';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { UsersService } from '@/modules/master-data/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignupService {
	protected logCtx = this.constructor.name;

	constructor(
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
	) {}

	async execute(dto: SignUpDto): Promise<SignUpResponseDto> {
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
}
