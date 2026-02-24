import { createZodDto } from 'nestjs-zod';
import { MailBaseSchema } from './mail.dto';

export const SendMailSchema = MailBaseSchema;
export class SendMailDto extends createZodDto(SendMailSchema) {
	static schema = SendMailSchema;
}

export class SendMailResponseDto {}
