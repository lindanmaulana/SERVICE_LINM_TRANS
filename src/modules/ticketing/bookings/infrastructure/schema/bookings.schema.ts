import { UsersTable } from '@/core/database/drizzle/schema';
import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { SchedulesTable } from '@/modules/operations/schedules/infrastructure/schema/schedules.schema';
import { CouponsTable } from '@/modules/ticketing/coupons/infrastructure/schema/coupons.schema';
import { PassengersTable } from '@/modules/ticketing/passengers/infrastructure/schema/passengers.schema';
import { TransactionsTable } from '@/modules/ticketing/payments/infrastructure/schema/transactions.schema';
import { relations } from 'drizzle-orm';
import { pgTable, uuid, numeric, pgEnum, varchar } from 'drizzle-orm/pg-core';

export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED']);

export const BookingsTable = pgTable('bookings', {
	id: uuid().primaryKey().defaultRandom(),
	bookingCode: varchar('booking_code', { length: 50 }).notNull().unique(),
	userId: uuid('user_id')
		.references(() => UsersTable.id)
		.notNull(),
	scheduleId: uuid('schedule_id')
		.references(() => SchedulesTable.id)
		.notNull(),
	couponId: uuid('coupon_id').references(() => CouponsTable.id),
	basePriceTotal: numeric('base_price_total', { precision: 12, scale: 2 }).notNull(),
	discountTotal: numeric('discount_total', { precision: 12, scale: 2 }).notNull(),
	finalPrice: numeric('final_price', { precision: 12, scale: 2 }).notNull(),
	status: bookingStatusEnum().default('PENDING'),
	...softDelete,
	...timestamps,
});

export const BookingsRelations = relations(BookingsTable, ({ one }) => ({
	user: one(UsersTable, {
		fields: [BookingsTable.userId],
		references: [UsersTable.id],
	}),

	schedule: one(SchedulesTable, {
		fields: [BookingsTable.scheduleId],
		references: [SchedulesTable.id],
	}),

	coupon: one(CouponsTable, {
		fields: [BookingsTable.couponId],
		references: [CouponsTable.id],
	}),

	transaction: one(TransactionsTable, {
		fields: [BookingsTable.id],
		references: [TransactionsTable.bookingId],
	}),

	passenger: one(PassengersTable, {
		fields: [BookingsTable.id],
		references: [PassengersTable.bookingId],
	}),
}));

export type Bookings = typeof BookingsTable.$inferInsert;
