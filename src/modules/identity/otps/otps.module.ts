import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import { OtpsSharedService } from './otps-shared.service';
import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { OtpDrizzleRepository } from '@/modules/identity/otps/infrastructure/persistances/otp-drizzle.repository';
import { MailModule } from '../mail/mail.module';
import { DrizzleModule } from '@/core/database/drizzle/drizzle.module';

@Module({
	imports: [DrizzleModule, MailModule],
	controllers: [OtpsController],
	providers: [
		OtpsService,
		OtpsSharedService,
		{
			provide: REPOSITORY_TOKENS.OTP,
			useClass: OtpDrizzleRepository,
		},
	],
	exports: [OtpsService, OtpsSharedService],
})
export class OtpsModule {}
