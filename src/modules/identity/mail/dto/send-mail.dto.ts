import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MailBaseSchema } from './mail.dto';

export const SendMailSchema = MailBaseSchema.omit({
	from: true,
}).extend({
	otpCode: z.string(),
	verificationLink: z.url(),
	templateName: z.string(),
	currentEmail: z.email().optional().nullable(),
	newEmail: z.email().optional().nullable()
});

export class SendMailDto extends createZodDto(SendMailSchema) {
	static schema = SendMailSchema;
}

export class SendMailResponseDto {}
