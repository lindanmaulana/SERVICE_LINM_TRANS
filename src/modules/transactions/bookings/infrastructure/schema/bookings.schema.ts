import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { pgTable, uuid, numeric, pgEnum, varchar } from 'drizzle-orm/pg-core';

export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED']);

export const BookingsTable = pgTable('bookings', {
	id: uuid().primaryKey().defaultRandom(),
	bookingCode: varchar({ length: 50 }).notNull().unique(),
	userId: uuid().notNull(),
	scheduleId: uuid().notNull(),
	couponId: uuid().notNull(),
	basePriceTotal: numeric({ precision: 12, scale: 2 }).notNull(),
	discountTotal: numeric({ precision: 12, scale: 0 }).notNull(),
	finalPrice: numeric({ precision: 12, scale: 2 }).notNull(),
	status: bookingStatusEnum().default('PENDING'),
	...softDelete,
	...timestamps,
});
