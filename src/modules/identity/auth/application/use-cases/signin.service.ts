import { JwtTypeToken } from '@/common/const/jwt-token-type.const';
import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { SigninDto, SigninResponseDto } from '@/modules/identity/auth/dto';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { UsersService } from '@/modules/master-data/users/users.service';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class SigninService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async execute(dto: SigninDto): Promise<SigninResponseDto> {
		const userEntity = await this.userService.findEntityByEmail(dto.email);
		if (!userEntity || !userEntity.password) throw new BadRequestException('Kredensial tidak valid');

		const isPasswordValid = await this.libHash.compare(dto.password, userEntity.password);
		if (!isPasswordValid) throw new BadRequestException('Kredensial tidak valid');

		if (userEntity.isDeleted()) throw new NotFoundException('Kredensial tidak valid');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun anda ditangguhkan. Silahkan hubungi admin');
		if (userEntity.isPending())
			throw new ForbiddenException('Akun anda belum aktif. Silahkan lakukan aktivasi terlebih dulu');

		const accessToken = await this.jwtService.signAsync({
			id: userEntity.id,
			email: userEntity.email,
			role: userEntity.role,
			name: userEntity.name ?? 'User',
			status: userEntity.status,
			type: JwtTypeToken.ACCESS_TOKEN,
		});

		return AuthResponseMapper.toAuthSignin(userEntity, accessToken);
	}
}
