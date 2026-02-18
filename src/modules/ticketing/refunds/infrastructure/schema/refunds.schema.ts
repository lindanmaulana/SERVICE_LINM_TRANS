import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { TransactionsTable } from '@/modules/ticketing/payments/infrastructure/schema/transactions.schema';
import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const refundStatusEnum = pgEnum('transaction_status', ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']);

export const RefundsTable = pgTable('refunds', {
	id: uuid().primaryKey().defaultRandom(),
	transactionId: uuid('transaction_id')
		.references(() => TransactionsTable.id)
		.notNull(),
	amount: numeric({ precision: 12, scale: 2 }).notNull(),
	reason: text().notNull(),
	status: refundStatusEnum().default('PENDING'),
	adminNotes: text('admin_notes').notNull(),
	processedAt: timestamp('processed_at', { withTimezone: true }).defaultNow().notNull(),
	...softDelete,
	...timestamps,
});

export const RefundsRelations = relations(RefundsTable, ({ one }) => ({
	transaction: one(TransactionsTable, {
		fields: [RefundsTable.transactionId],
		references: [TransactionsTable.id],
	}),
}));
