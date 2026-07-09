import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      productCount: sql<number>`count(${productsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, sql`${productsTable.categoryId} = ${categoriesTable.id}`)
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.sortOrder);

  res.json(ListCategoriesResponse.parse(rows));
});

export default router;
