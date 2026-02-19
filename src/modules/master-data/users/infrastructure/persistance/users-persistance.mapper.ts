import { Users } from '@/modules/master-data/users/infrastructure/schema/users.schema';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';

export class UserPersistanceMapper {
	static toEntity(user: Users): User {
		return User.restore({
			id: user.id,
			email: user.email,
			password: user.password,
			name: user.name,
			role: user.role,
			provider: user.provider,
			providerId: user.providerId,
			avatar: user.avatar,
			created_at: user.createdAt,
			updated_at: user.updatedAt,
			deleted_at: user.deletedAt,
		});
	}

	static toPersistence(entity: User) {
		const data = {
			email: entity.email,
			password: entity.password,
			name: entity.name,
			role: entity.role,
			provider: entity.provider,
			providerId: entity.providerId,
			avatar: entity.avatar,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
			deleted_at: entity.deletedAt,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return data;
	}
}
