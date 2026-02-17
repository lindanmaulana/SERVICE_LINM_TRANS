import { timestamps } from '@/core/database/helpers/column.helpers';
import { SeatsTable } from '@/modules/operations/seats/infrastructure/schema/seats.schema';
import { BookingsTable } from '@/modules/ticketing/bookings/infrastructure/schema/bookings.schema';
import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const PassengersTable = pgTable('passengers', {
	id: uuid().primaryKey().defaultRandom(),
	bookingId: uuid()
		.references(() => BookingsTable.id)
		.notNull(),
	seatId: uuid()
		.references(() => SeatsTable.id)
		.notNull(),
	name: varchar({ length: 100 }).notNull(),
	identityNo: varchar({ length: 30 }).notNull(),
	...timestamps,
});

export const PassengersRelations = relations(PassengersTable, ({ one }) => ({
	booking: one(BookingsTable, {
		fields: [PassengersTable.bookingId],
		references: [BookingsTable.id],
	}),

	seat: one(SeatsTable, {
		fields: [PassengersTable.seatId],
		references: [SeatsTable.id],
	}),
}));
