import { Injectable } from '@nestjs/common';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
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
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	static toGetProfile(user: User): GetProfileUserResponseDto {
		return this.base(user);
	}
}
