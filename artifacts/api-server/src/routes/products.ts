import { Router, type IRouter } from "express";
import { and, eq, gte, lte, ilike, desc } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
} from "@workspace/api-zod";

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

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { categorySlug, search, availability, minPrice, maxPrice, featured } = parsed.data;

  const conditions = [];
  if (categorySlug) conditions.push(eq(categoriesTable.slug, categorySlug));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (availability) conditions.push(eq(productsTable.availability, availability));
  if (minPrice !== undefined) conditions.push(gte(productsTable.price, String(minPrice)));
  if (maxPrice !== undefined) conditions.push(lte(productsTable.price, String(maxPrice)));
  if (featured !== undefined) conditions.push(eq(productsTable.featured, featured));

  const rows = await db
    .select(productSelect)
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(productsTable.featured), productsTable.name);

  const normalized = rows.map((row) => ({
    ...row,
    price: Number(row.price),
    oldPrice: row.oldPrice !== null ? Number(row.oldPrice) : null,
  }));

  res.json(ListProductsResponse.parse(normalized));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select(productSelect)
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const normalizedProduct = {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice !== null ? Number(product.oldPrice) : null,
  };

  res.json(GetProductResponse.parse(normalizedProduct));
});

export default router;
