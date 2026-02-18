ALTER TABLE "bookings" DROP CONSTRAINT "bookings_bookingCode_unique";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_externalId_unique";--> statement-breakpoint
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_busId_buses_id_fk";
--> statement-breakpoint
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_routeId_routes_id_fk";
--> statement-breakpoint
ALTER TABLE "seats" DROP CONSTRAINT "seats_scheduleId_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_scheduleId_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_couponId_coupons_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_scheduleId_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_busId_buses_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_routeId_routes_id_fk";
--> statement-breakpoint
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_bookingId_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_seatId_seats_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bookingId_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_transactionId_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "bus_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "route_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "departure_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "arrival_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "base_price" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "seats" ADD COLUMN "schedule_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "seats" ADD COLUMN "seat_number" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "seats" ADD COLUMN "is_available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booking_code" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "schedule_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "coupon_id" uuid;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "base_price_total" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "discount_total" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "final_price" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "min_purchase" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "max_usage" integer;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "used_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "expired_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "schedule_id" uuid;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "bus_id" uuid;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "route_id" uuid;--> statement-breakpoint
ALTER TABLE "passengers" ADD COLUMN "booking_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "passengers" ADD COLUMN "seat_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "passengers" ADD COLUMN "identity_no" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "booking_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "external_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_type" varchar(50);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "raw_response" jsonb;--> statement-breakpoint
ALTER TABLE "refunds" ADD COLUMN "transaction_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "refunds" ADD COLUMN "admin_notes" text NOT NULL;--> statement-breakpoint
ALTER TABLE "refunds" ADD COLUMN "processed_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "providerId";--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "busId";--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "routeId";--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "departureTime";--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "arrivalTime";--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "basePrice";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "scheduleId";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "seatNumber";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "isAvailable";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "bookingCode";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "scheduleId";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "couponId";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "basePriceTotal";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "discountTotal";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "finalPrice";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "minPurchase";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "maxUsage";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "usedCount";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "isActive";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "expiredDate";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "scheduleId";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "busId";--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "routeId";--> statement-breakpoint
ALTER TABLE "passengers" DROP COLUMN "bookingId";--> statement-breakpoint
ALTER TABLE "passengers" DROP COLUMN "seatId";--> statement-breakpoint
ALTER TABLE "passengers" DROP COLUMN "identityNo";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "bookingId";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "externalId";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "paymentType";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "rawResponse";--> statement-breakpoint
ALTER TABLE "refunds" DROP COLUMN "transactionId";--> statement-breakpoint
ALTER TABLE "refunds" DROP COLUMN "adminNotes";--> statement-breakpoint
ALTER TABLE "refunds" DROP COLUMN "processedAt";--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_code_unique" UNIQUE("booking_code");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_external_id_unique" UNIQUE("external_id");