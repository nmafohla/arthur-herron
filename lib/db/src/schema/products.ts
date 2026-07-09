import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const products_pricingTypeValues = ["fixed", "per_kg", "pack"] as const;
export const products_availabilityValues = ["in_stock", "limited", "order_ahead"] as const;

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  pricingType: text("pricing_type", { enum: products_pricingTypeValues }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  promoTag: text("promo_tag"),
  availability: text("availability", { enum: products_availabilityValues }).notNull().default("in_stock"),
  stockQuantity: integer("stock_quantity"),
  imageUrl: text("image_url").notNull(),
  galleryUrls: text("gallery_urls").array().notNull().default([]),
  cutOptions: text("cut_options").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  preparationNote: text("preparation_note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
