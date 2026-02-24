import { timestamps } from '@/core/database/helpers/column.helpers';
import { UsersTable } from '@/modules/master-data/master-data.schema';
import { relations } from 'drizzle-orm';
import { pgTable, pgEnum, uuid, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const otpTypeEnum = pgEnum('otp_type', ['REGISTER_VERIFICATION', 'RESET_PASSWORD', 'CHANGE_EMAIL']);

export const OtpsTable = pgTable('otps', {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => UsersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	otpCode: varchar('otp_code', { length: 6 }).notNull(),
	isUsed: boolean('is_used').default(false).notNull(),
	expiryDate: timestamp({ withTimezone: true }).notNull(),
	type: otpTypeEnum().notNull(),
	attempts: integer().default(0).notNull(),
	...timestamps,
});

export const OtpsRelations = relations(OtpsTable, ({ one, many }) => ({
	user: one(UsersTable, {
		fields: [OtpsTable.userId],
		references: [UsersTable.id],
	}),
}));
