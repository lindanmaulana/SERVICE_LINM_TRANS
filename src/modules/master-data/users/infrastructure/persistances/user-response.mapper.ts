import type { TypeBaseMetaDto } from '@/common/dto/pagination.dto';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { GetAllUserResponseDto } from '../../dto/get-all.dto';
import { GetOneUserResponseDto } from '../../dto/get-one-user.dto';
import { GetProfileUserResponseDto } from '../../dto/get-profile-user.dto';

@Injectable()
export class UserResponseMapper {
	static base(user: User) {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			provider: user.provider,
			avatar: user.avatar,
			status: user.status,
			createdAt: user.createdAt.toString(),
			updatedAt: user.updatedAt.toString(),
		};
	}

	static toGetProfile(user: User): GetProfileUserResponseDto {
		return this.base(user);
	}

	static toGetOne(user: User): GetOneUserResponseDto {
		return {
			...this.base(user),
			providerId: user.providerId,
			deletedAt: user.deletedAt ? user.deletedAt.toString() : null,
		};
	}

	static toFindAll(users: User[], meta: TypeBaseMetaDto): GetAllUserResponseDto {
		return {
			user: users.map((user) => {
				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					provider: user.provider,
					providerId: user.providerId,
					avatar: user.avatar,
					status: user.status,
					createdAt: user.createdAt.toString(),
					updatedAt: user.updatedAt.toString(),
					deletedAt: user.deletedAt ? user.deletedAt.toString() : null,
				};
			}),
			meta: meta,
		};
	}
}
