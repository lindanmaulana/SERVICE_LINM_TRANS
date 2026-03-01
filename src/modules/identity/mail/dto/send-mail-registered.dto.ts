import { createZodDto } from 'nestjs-zod';
import { MailBaseSchema } from './mail.dto';
import z from 'zod';

export const SendMailRegisteredSchema = MailBaseSchema.pick({
	to: true,
}).extend({
	otpCode: z.string(),
	verificationLink: z.url(),
});

export class SendMailRegisteredDto extends createZodDto(SendMailRegisteredSchema) {
	static schema = SendMailRegisteredSchema;
}

export class SendMailRegisteredResponseDto {}
