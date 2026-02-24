import { OtpType } from '@/common/const/otp-type.const';
import z from 'zod';

export const OtpBaseSchema = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	otp_code: z.string().min(6).max(6),
	is_used: z.boolean().default(false),
	expiry_date: z.date(),
	type: z.enum(OtpType),
	attempts: z.coerce.number().int().nonnegative({ error: 'Attempts tidak boleh kurang dari 0' }).default(0),
	created_at: z.date(),
	updated_at: z.date(),
});
