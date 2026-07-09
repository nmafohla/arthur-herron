import { Router, type IRouter, type Request } from "express";
import { desc, eq, inArray } from "drizzle-orm";
import { clerkClient } from "@clerk/express";
import { db, ordersTable, orderItemsTable, usersTable } from "@workspace/db";
import { GetMeResponse, GetMyOrdersResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

function normalizeUser(user: typeof usersTable.$inferSelect) {
  return {
    ...user,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  };
}

function normalizeOrder(
  order: typeof ordersTable.$inferSelect,
  items: (typeof orderItemsTable.$inferSelect)[],
) {
  return {
    ...order,
    deliveryFee: Number(order.deliveryFee),
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    items: items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
  };
}

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;

  let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    let email: string | null = null;
    let fullName: string | null = null;
    let phone: string | null = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email =
        clerkUser.primaryEmailAddress?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        null;
      fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
      phone = clerkUser.primaryPhoneNumber?.phoneNumber ?? null;
    } catch (err) {
      req.log.warn({ err }, "Failed to load Clerk user during provisioning");
    }

    await db.insert(usersTable).values({ id: userId, email, fullName, phone }).onConflictDoNothing();
    [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  }

  res.json(GetMeResponse.parse(normalizeUser(user)));
});

router.get("/me/orders", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(desc(ordersTable.createdAt));

  if (orders.length === 0) {
    res.json(GetMyOrdersResponse.parse([]));
    return;
  }

  const orderIds = orders.map((o) => o.id);
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(inArray(orderItemsTable.orderId, orderIds));

  const itemsByOrder = new Map<number, (typeof orderItemsTable.$inferSelect)[]>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  const result = orders.map((order) => normalizeOrder(order, itemsByOrder.get(order.id) ?? []));
  res.json(GetMyOrdersResponse.parse(result));
});

export default router;
