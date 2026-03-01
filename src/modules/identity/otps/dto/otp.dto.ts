import { OtpType } from '@/common/const/otp-type.const';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { OtpsTable } from '../infrastructure/schemas/otp.schema';

export const OtpBaseSchema = createSelectSchema(OtpsTable, {
	id: z.uuid(),
	userId: z.uuid(),
	otpCode: z.string().min(6).max(6),
	isUsed: z.boolean().default(false),
	expiryDate: z
		.string()
		.refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Tanggal tidak valid' })
		.transform((v) => new Date(v)),
	type: z.enum(OtpType),
	attempts: z.coerce.number().int().nonnegative({ error: 'Attempts tidak boleh kurang dari 0' }).default(0),
	createdAt: z.date(),
	updatedAt: z.date(),
});
