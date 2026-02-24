import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Module({
	controllers: [MailController],
	providers: [
		MailService,
		{
			provide: LIBRARY_TOKENS.RESEND,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const apiKey = configService.get<string>('resend.ResendApiKey');

				return new Resend(apiKey);
			},
		},
	],
})
export class MailModule {}
