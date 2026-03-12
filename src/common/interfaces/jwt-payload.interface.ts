import { UserRoleType } from '../const/user-role.const';
import { UserStatusType } from '../const/user.const';

export interface JwtPayload {
	id: string;
	email: string;
	name: string;
	role: UserRoleType;
	status: UserStatusType;
}
