import { User } from '@/modules/master-data/users/domain/entities/user.entity';

export interface UserRepository {
	transaction(tx: any): UserRepository;
	
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;

	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<User>;

	activate(id: string): Promise<void>;
}
