import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const RequestChangeEmailSchema = z.object({
	currentEmail: z
		.email({ error: 'Email saat ini tidak valid' })
		.min(1, { error: 'Email saat ini tidak boleh kosong' }),
	newEmail: z.email({ error: 'Email baru tidak valid' }).min(1, { error: 'Email baru tidak boleh kosong' }),
});

export class RequestChangeEmailDto extends createZodDto(RequestChangeEmailSchema) {
	static schema = RequestChangeEmailSchema
}
