import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
  GetAdminSessionResponse,
  ListAdminProductsResponse,
  CreateAdminProductBody,
  CreateAdminProductResponse,
  UpdateAdminProductParams,
  UpdateAdminProductBody,
  UpdateAdminProductResponse,
  DeleteAdminProductParams,
  DeleteAdminProductResponse,
} from "@workspace/api-zod";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionTokenFromRequest,
  isValidSessionToken,
  verifyPassword,
  requireAdmin,
} from "../lib/adminSession";

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
  stockQuantity: productsTable.stockQuantity,
  imageUrl: productsTable.imageUrl,
  galleryUrls: productsTable.galleryUrls,
  cutOptions: productsTable.cutOptions,
  featured: productsTable.featured,
  preparationNote: productsTable.preparationNote,
};

function normalizeProduct(row: Record<string, unknown>) {
  return {
    ...row,
    price: Number(row["price"]),
    oldPrice: row["oldPrice"] !== null && row["oldPrice"] !== undefined ? Number(row["oldPrice"]) : null,
  };
}

router.post("/admin/login", (req, res): void => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!verifyPassword(parsed.data.password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = createSessionToken();
  setSessionCookie(res, token);
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.post("/admin/logout", (req, res): void => {
  clearSessionCookie(res);
  res.json(AdminLogoutResponse.parse({ authenticated: false }));
});

router.get("/admin/session", (req, res): void => {
  const token = getSessionTokenFromRequest(req);
  res.json(GetAdminSessionResponse.parse({ authenticated: isValidSessionToken(token) }));
});

router.get("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db
    .select(productSelect)
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .orderBy(productsTable.name);

  const normalized = rows.map(normalizeProduct);
  res.json(ListAdminProductsResponse.parse(normalized));
});

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAdminProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, ...rest } = parsed.data;

  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId));
  if (!category) {
    res.status(400).json({ error: "Invalid categoryId" });
    return;
  }

  const [inserted] = await db
    .insert(productsTable)
    .values({ ...rest, categoryId, price: String(rest.price), oldPrice: rest.oldPrice !== null ? String(rest.oldPrice) : null })
    .returning();

  if (!inserted) {
    res.status(500).json({ error: "Failed to create product" });
    return;
  }

  const created = normalizeProduct({
    ...inserted,
    categorySlug: category.slug,
    categoryName: category.name,
  });

  res.status(201).json(CreateAdminProductResponse.parse(created));
});

router.patch("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAdminProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAdminProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const { categoryId, price, oldPrice, ...rest } = parsed.data;

  if (categoryId !== undefined) {
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId));
    if (!category) {
      res.status(400).json({ error: "Invalid categoryId" });
      return;
    }
  }

  const updateValues: Record<string, unknown> = { ...rest };
  if (categoryId !== undefined) updateValues["categoryId"] = categoryId;
  if (price !== undefined) updateValues["price"] = String(price);
  if (oldPrice !== undefined) updateValues["oldPrice"] = oldPrice !== null ? String(oldPrice) : null;

  await db.update(productsTable).set(updateValues).where(eq(productsTable.id, params.data.id));

  const [row] = await db
    .select(productSelect)
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(UpdateAdminProductResponse.parse(normalizeProduct(row)));
});

router.delete("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteAdminProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, params.data.id));

  res.json(DeleteAdminProductResponse.parse({ authenticated: true }));
});

export default router;
