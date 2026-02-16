import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { boolean, integer, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const couponTypeEnum = pgEnum('coupon_type', ['FIXED', 'PERCENTAGE']);

export const CouponsTable = pgTable('coupons', {
	id: uuid().primaryKey().defaultRandom(),
	code: varchar({ length: 50 }).notNull().unique(),
	type: couponTypeEnum().default('PERCENTAGE'),
	value: numeric({ precision: 12, scale: 2 }).notNull(),
	minPurchase: numeric({ precision: 12, scale: 2 }).notNull().default('0'),
	maxUsage: integer(),
	usedCount: integer().notNull().default(0),
	isActive: boolean().notNull().default(true),
	expiredDate: timestamp({ withTimezone: true }).notNull(),
	...softDelete,
	...timestamps,
});
