import { ROLES } from '../enums/role.enum';

export interface JwtPayload {
	id: string;
	email: string;
	name: string;
	role: ROLES;
}
