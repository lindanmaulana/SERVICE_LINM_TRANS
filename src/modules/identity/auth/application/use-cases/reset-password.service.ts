import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '@/modules/master-data/users/users.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
import { LIBRARY_TOKENS } from '@/common/const/token.const';
import bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly userService: UsersService,
	) {}

	async execute(user: JwtPayload | OauthGooglePayload, dto: ResetPasswordDto): Promise<void> {
		if (dto.password !== dto.confirmPassword)
			throw new BadRequestException('Password dan Confirm Password tidak valid');

		const userEntity = await this.userService.findOneByEmail(user.email);
		if (!userEntity || userEntity === null) throw new NotFoundException('Akun tidak ditemukan');

		if (userEntity.isDeleted()) throw new NotFoundException('Akun tidak ditemukan');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun anda ditangguhkan. Silahkan hubungi admin');
		if (!userEntity.isActive())
			throw new ForbiddenException('Akun anda melakukan aktivasi. Silahkan aktivasi terlebih dahulu');

		await this.userService.updatePassword(userEntity, dto.password);
	}
}
