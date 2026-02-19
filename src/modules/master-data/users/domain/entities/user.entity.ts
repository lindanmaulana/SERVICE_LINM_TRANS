import { UserRole, UserRoleType } from '@/common/const/user-role.const';
import { BadRequestException } from '@nestjs/common';

export class User {
	constructor(
		private readonly _id: string | undefined,
		private _email: string,
		private _password: string | null,
		private _name: string | null,
		private _role: UserRoleType,
		private _provider: string,
		private _provider_id: string | null,
		private _avatar: string | null,
		private _created_at: Date,
		private _updated_at: Date,
		private _deleted_at: Date | null,
	) {
		if (this._email) {
			const normalize = this._email.trim().toLocaleLowerCase();

			if (!normalize.endsWith('@gmail.com')) throw new BadRequestException('Format email tidak valid');
		}

		if (this._role === UserRole.CUSTOMER && this._name !== null) {
			const normalize = this._name.toLocaleLowerCase();

			if (normalize.includes('admin')) throw new BadRequestException('Nama pengguna tidak diperbolehkan');
		}

		if (this._password !== null) {
			const normalize = this._password.trim();

			if (normalize.length < 8) throw new BadRequestException('Password minimal 8 karakter!');
		}
	}

	static restore(props: {
		id: string;
		email: string;
		password: string | null;
		name: string | null;
		role: UserRoleType;
		provider: string;
		providerId: string | null;
		avatar: string | null;
		created_at: Date;
		updated_at: Date;
		deleted_at: Date | null;
	}): User {
		return new User(
			props.id,
			props.email,
			props.password,
			props.name,
			props.role,
			props.provider,
			props.providerId,
			props.avatar,
			props.created_at,
			props.updated_at,
			props.deleted_at,
		);
	}

	static create(props: {
		email: string;
		password: string | null;
		name: string | null;
		role: UserRoleType;
		provider: string;
		providerId: string | null;
		avatar: string | null;
	}): User {
		return new User(
			undefined,
			props.email,
			props.password,
			props.name,
			props.role,
			props.provider,
			props.providerId,
			props.avatar,
			new Date(),
			new Date(),
			null,
		);
	}

	update(props: { name?: string; email?: string; password?: string }) {
		if (props.name !== undefined) this.changeName(props.name);
		if (props.email !== undefined) this._email = props.email;
		if (props.password !== undefined) this._password = props.password;

		this.updated();
	}

	changeEmail(email: string) {
		const normalize = email.trim().toLowerCase();
		if (!normalize.endsWith('@gmail.com')) throw new BadRequestException('Format email tidak valid');

		this._email = normalize;
		this.updated();
	}

	changeName(name: string) {
		const normalize = name.trim();

		if (this._name === normalize)
			throw new BadRequestException('Nama baru tidak boleh sama dengan nama sebelumnya!');

		this._name = normalize;
		this.updated();
	}

	get id(): string {
		if (this._id === undefined) throw new Error('Id cannot be accessed because the entity is not persisted yet.');

		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get password(): string | null {
		return this._password;
	}

	get name(): string | null {
		return this._name;
	}

	get role(): UserRoleType {
		return this._role;
	}

	get provider(): string {
		return this._provider;
	}

	get providerId(): string | null {
		return this._provider_id;
	}

	get avatar(): string | null {
		return this._avatar;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get updatedAt(): Date {
		return this._updated_at;
	}

	get deletedAt(): Date | null {
		return this._deleted_at;
	}

	private updated() {
		this._updated_at = new Date();
	}

	private thisTime() {
		return new Date();
	}
}
