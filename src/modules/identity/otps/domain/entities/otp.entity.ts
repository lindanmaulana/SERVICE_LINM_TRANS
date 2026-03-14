import { OtpType } from '@/common/const/otp-type.const';
import { MS } from '@/common/utils/time.util';

export class Otp {
	constructor(
		private readonly _id: string | undefined,
		private _user_id: string,
		private _otp_code: string,
		private _is_used: boolean,
		private _expiry_date: Date,
		private _type: OtpType,
		private _attempts: number,
		private _created_at: Date,
		private _updated_at: Date,
	) {}

	static restore(props: {
		id: string;
		user_id: string;
		otp_code: string;
		is_used: boolean;
		expiry_date: Date;
		type: OtpType;
		attempts: number;
		created_at: Date;
		updated_at: Date;
	}): Otp {
		return new Otp(
			props.id,
			props.user_id,
			props.otp_code,
			props.is_used,
			props.expiry_date,
			props.type,
			props.attempts,
			props.created_at,
			props.updated_at,
		);
	}

	static create(props: {
		user_id: string;
		otp_code: string;
		is_used: boolean;
		expiry_date: Date;
		type: OtpType;
		attempts: number;
	}): Otp {
		return new Otp(
			undefined,
			props.user_id,
			props.otp_code,
			props.is_used,
			props.expiry_date,
			props.type,
			props.attempts,
			new Date(),
			new Date(),
		);
	}

	private updated(): void {
		this._updated_at = new Date();
	}

	private extendExpiryDate(date: Date, minute: number): void {
		const extend = date.getTime() + MS.MINUTE * minute;

		this._expiry_date = new Date(extend);
	}

	adddAttempts(): void {
		this._attempts += 1;
	}

	isCreatedWithinMinutes(minute: number): boolean {
		const minuteAgo = Date.now() - MS.MINUTE * minute;

		return this._created_at.getTime() > minuteAgo;
	}

	isExpired(): boolean {
		return this._expiry_date.getTime() < Date.now();
	}

	markAsUsed() {
		this._is_used = true;
	}

	get id(): string {
		if (this._id === undefined) throw new Error('ID tidak dapat di akses karena entitas belum disimpan.');

		return this._id;
	}

	get userId(): string {
		return this._user_id;
	}

	get otpCode(): string {
		return this._otp_code;
	}

	get isUsed(): boolean {
		return this._is_used;
	}

	get expiryDate(): Date {
		return this._expiry_date;
	}

	get type(): OtpType {
		return this._type;
	}

	get attempts(): number {
		return this._attempts;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get updatedAt(): Date {
		return this._updated_at;
	}
}
