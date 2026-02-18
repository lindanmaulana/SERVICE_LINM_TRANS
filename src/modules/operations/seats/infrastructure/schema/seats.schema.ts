import { timestamps } from '@/core/database/helpers/column.helpers';
import { SchedulesTable } from '@/modules/operations/schedules/infrastructure/schema/schedules.schema';
import { PassengersTable } from '@/modules/ticketing/passengers/infrastructure/schema/passengers.schema';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const SeatsTable = pgTable('seats', {
	id: uuid().primaryKey().defaultRandom(),
	scheduleId: uuid('schedule_id')
		.references(() => SchedulesTable.id)
		.notNull(),
	seatNumber: varchar('seat_number', { length: 10 }).notNull(),
	isAvailable: boolean('is_available').notNull().default(true),
	...timestamps,
});

export const SeatsRelations = relations(SeatsTable, ({ one }) => ({
	schedule: one(SchedulesTable, {
		fields: [SeatsTable.scheduleId],
		references: [SchedulesTable.id],
	}),

	passenger: one(PassengersTable, {
		fields: [SeatsTable.id],
		references: [PassengersTable.seatId],
	}),
}));
