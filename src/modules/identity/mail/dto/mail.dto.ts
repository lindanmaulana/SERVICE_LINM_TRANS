import z from 'zod';

export const MailBaseSchema = z.object({
	from: z.email().min(1, { error: 'Email sumber tidak boleh kosong!' }),
	to: z.email().min(1, { error: 'Email tujuan tidak boleh kosong!' }),
	subject: z.string().min(1, { error: 'Subjek tidak boleh kosong!' }),
	text: z.string(),
});
