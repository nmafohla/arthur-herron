import { pgTable, text, serial, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const deliveryZonesTable = pgTable("delivery_zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fee: numeric("fee", { precision: 10, scale: 2 }).notNull(),
  etaText: text("eta_text").notNull(),
  sameDayCutoff: text("same_day_cutoff").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDeliveryZoneSchema = createInsertSchema(deliveryZonesTable).omit({ id: true, createdAt: true });
export type InsertDeliveryZone = z.infer<typeof insertDeliveryZoneSchema>;
export type DeliveryZone = typeof deliveryZonesTable.$inferSelect;
