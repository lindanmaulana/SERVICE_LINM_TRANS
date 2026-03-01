
// User Role
export const UserRole = {
	ADMIN: 'ADMIN',
	CUSTOMER: 'CUSTOMER',
} as const;

export type UserRoleType = 'ADMIN' | 'CUSTOMER';
export const RoleAccepted = [UserRole.ADMIN, UserRole.CUSTOMER] as const;



// User Status
export const UserStatus = {
	PENDING: 'PENDING',
	ACTIVE: 'ACTIVE',
	BANNED: 'BANNED',
} as const;
export type UserStatusType = 'PENDING' | 'ACTIVE' | 'BANNED';
export const UserStatusAccepted = [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.BANNED];
