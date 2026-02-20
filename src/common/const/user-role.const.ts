export const UserRole = {
	ADMIN: 'ADMIN',
	CUSTOMER: 'CUSTOMER',
} as const;

export type UserRoleType = 'ADMIN' | 'CUSTOMER';
export const RoleAccepted = [UserRole.ADMIN, UserRole.CUSTOMER] as const;
