import { Module } from '@nestjs/common';
import { OtpsModule } from './otps/otps.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [OtpsModule, AuthModule, MailModule],
})
export class IdentityModule {}
