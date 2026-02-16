import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
	created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
};

export const softDelete = {
	deleted_at: timestamp({ withTimezone: true }),
};
