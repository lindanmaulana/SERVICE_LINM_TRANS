import { UserRoleType } from '../const/user-role.const';

export interface JwtPayload {
	id: string;
	email: string;
	name: string;
	role: UserRoleType;
}
