ALTER TABLE "schedules" DROP CONSTRAINT "schedules_bus_id_buses_id_fk";
--> statement-breakpoint
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_route_id_routes_id_fk";
--> statement-breakpoint
ALTER TABLE "seats" DROP CONSTRAINT "seats_schedule_id_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_schedule_id_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_coupon_id_coupons_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_schedule_id_schedules_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_bus_id_buses_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_route_id_routes_id_fk";
--> statement-breakpoint
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "passengers" DROP CONSTRAINT "passengers_seat_id_seats_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_transaction_id_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE restrict ON UPDATE cascade;