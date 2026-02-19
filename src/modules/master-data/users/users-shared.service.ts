import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from './domain/repositories/user.repository.interface';

@Injectable()
export class UsersSharedService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	async validateUserExistsById(id: string): Promise<User> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			this.logger.warn('Failed data user by id tidak ditemukan', { context: this.logContext, userId: id });
			throw new NotFoundException('Data user tidak ditemukan');
		}

		return user;
	}

	async validateUserExistsByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			this.logger.warn('Failed data user by email tidak ditemukan', { context: this.logContext, email: email });
			throw new NotFoundException('Data user tidak ditemukan');
		}

		return user;
	}
}
