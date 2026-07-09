import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { deliveryZonesTable } from "./delivery-zones";
import { productsTable } from "./products";

export const orders_fulfillmentTypeValues = ["delivery", "pickup"] as const;
export const orders_statusValues = ["pending_payment", "confirmed", "payment_failed"] as const;

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  fulfillmentType: text("fulfillment_type", { enum: orders_fulfillmentTypeValues }).notNull(),
  address: text("address"),
  areaZoneId: integer("area_zone_id").references(() => deliveryZonesTable.id),
  areaZoneName: text("area_zone_name"),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  preferredDate: text("preferred_date").notNull(),
  preferredTimeWindow: text("preferred_time_window").notNull(),
  notes: text("notes"),
  status: text("status", { enum: orders_statusValues }).notNull().default("pending_payment"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentReferenceNumber: text("payment_reference_number"),
  paymentPollUrl: text("payment_poll_url"),
  pointsAwarded: boolean("points_awarded").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  productName: text("product_name").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  cutOption: text("cut_option"),
  note: text("note"),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({ id: true });
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItemsTable.$inferSelect;
