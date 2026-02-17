import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { CouponsModule } from './coupons/coupons.module';
import { PassengersModule } from './passengers/passengers.module';
import { PaymentsModule } from './payments/payments.module';
import { RefundsModule } from './refunds/refunds.module';

@Module({
	imports: [BookingsModule, CouponsModule, PassengersModule, PaymentsModule, RefundsModule],
})
export class TicketingModule {}
