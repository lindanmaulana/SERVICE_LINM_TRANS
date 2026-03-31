import { UserRoleType } from '@/common/const/user-role.const';
import { UserStatusType } from '@/common/const/user.const';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';

export interface UserFilter {
	search?: string;
	role?: UserRoleType;
	status?: UserStatusType;
	page: number;
	limit: number;
}

export interface UserRepository {
	transaction(tx: any): UserRepository;
	findAll(params: UserFilter): Promise<{ users: User[]; total: number }>;

	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;

	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<User>;

	activate(id: string): Promise<void>;
}
