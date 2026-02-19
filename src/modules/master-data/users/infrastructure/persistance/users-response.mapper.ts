import { Injectable } from '@nestjs/common';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';

@Injectable()
export class UserResponseMapper {
	static(base: User) {
		return {
			id: base.id,
			email: base.email,
			name: base.name,
			role: base.role,
			provider: base.provider,
			providerId: base.providerId,
			avatar: base.avatar,
			createdAt: base.createdAt,
			updatedAt: base.updatedAt,
		};
	}
}
