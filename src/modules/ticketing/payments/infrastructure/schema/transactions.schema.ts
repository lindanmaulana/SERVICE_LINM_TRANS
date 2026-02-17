import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { BookingsTable } from '@/modules/ticketing/bookings/infrastructure/schema/bookings.schema';
import { RefundsTable } from '@/modules/ticketing/refunds/infrastructure/schema/refunds.schema';
import { relations } from 'drizzle-orm';
import { jsonb, numeric, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'PAID', 'EXPIRED', 'FAILED', 'REFUNDED']);

export const TransactionsTable = pgTable('transactions', {
	id: uuid().primaryKey().defaultRandom(),
	bookingId: uuid()
		.references(() => BookingsTable.id)
		.notNull(),
	externalId: varchar({ length: 255 }).notNull().unique(),
	amount: numeric({ precision: 12, scale: 2 }).notNull(),
	currency: varchar({ length: 10 }).default('IDR').notNull(),
	status: transactionStatusEnum().default('PENDING').notNull(),
	paymentType: varchar({ length: 50 }),
	rawResponse: jsonb(),
	...softDelete,
	...timestamps,
});

export const TransactionsRelations = relations(TransactionsTable, ({ one }) => ({
	booking: one(BookingsTable, {
		fields: [TransactionsTable.bookingId],
		references: [BookingsTable.id],
	}),

	refund: one(RefundsTable, {
		fields: [TransactionsTable.id],
		references: [RefundsTable.transactionId],
	}),
}));
