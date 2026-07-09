import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, deliveryZonesTable } from "@workspace/db";
import { CreateOrderBody, CreateOrderResponse, GetOrderParams, GetOrderResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AH-${y}${m}${d}-${rand}`;
}

function normalizeOrder(order: typeof ordersTable.$inferSelect, items: (typeof orderItemsTable.$inferSelect)[]) {
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

async function loadFullOrder(orderId: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
  return normalizeOrder(order, items);
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid order payload");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;

  let deliveryFee = 0;
  let areaZoneName: string | null = null;
  if (body.fulfillmentType === "delivery" && body.areaZoneId != null) {
    const [zone] = await db.select().from(deliveryZonesTable).where(eq(deliveryZonesTable.id, body.areaZoneId));
    if (!zone) {
      res.status(400).json({ error: "Invalid delivery zone" });
      return;
    }
    deliveryFee = Number(zone.fee);
    areaZoneName = zone.name;
  }

  const subtotal = body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      fulfillmentType: body.fulfillmentType,
      address: body.address,
      areaZoneId: body.areaZoneId,
      areaZoneName,
      deliveryFee: String(deliveryFee),
      preferredDate: body.preferredDate,
      preferredTimeWindow: body.preferredTimeWindow,
      notes: body.notes,
      status: "pending_payment",
      subtotal: String(subtotal),
      total: String(total),
    })
    .returning();

  await db.insert(orderItemsTable).values(
    body.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
      cutOption: item.cutOption,
      note: item.note,
      lineTotal: String(item.quantity * item.unitPrice),
    })),
  );

  const fullOrder = await loadFullOrder(order.id);
  req.log.info({ orderNumber }, "Order created");
  res.status(201).json(CreateOrderResponse.parse(fullOrder));
});

router.get("/orders/:orderNumber", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.orderNumber, params.data.orderNumber));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const fullOrder = await loadFullOrder(order.id);
  res.json(GetOrderResponse.parse(fullOrder));
});

export default router;
