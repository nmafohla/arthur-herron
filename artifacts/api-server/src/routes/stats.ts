import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { GetStorefrontSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const productSelect = {
  id: productsTable.id,
  slug: productsTable.slug,
  name: productsTable.name,
  shortDescription: productsTable.shortDescription,
  description: productsTable.description,
  categorySlug: categoriesTable.slug,
  categoryName: categoriesTable.name,
  pricingType: productsTable.pricingType,
  price: productsTable.price,
  unit: productsTable.unit,
  oldPrice: productsTable.oldPrice,
  promoTag: productsTable.promoTag,
  availability: productsTable.availability,
  imageUrl: productsTable.imageUrl,
  galleryUrls: productsTable.galleryUrls,
  cutOptions: productsTable.cutOptions,
  featured: productsTable.featured,
  preparationNote: productsTable.preparationNote,
};

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const bestSellers = await db
    .select(productSelect)
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.featured, true))
    .orderBy(productsTable.name)
    .limit(8);

  const categoryCounts = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      productCount: sql<number>`count(${productsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.sortOrder);

  const [{ count: totalProducts }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable);

  const normalizedBestSellers = bestSellers.map((row) => ({
    ...row,
    price: Number(row.price),
    oldPrice: row.oldPrice !== null ? Number(row.oldPrice) : null,
  }));

  res.json(
    GetStorefrontSummaryResponse.parse({
      bestSellers: normalizedBestSellers,
      categoryCounts,
      totalProducts,
    }),
  );
});

export default router;
