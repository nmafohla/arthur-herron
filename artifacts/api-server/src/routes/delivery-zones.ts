import { Router, type IRouter } from "express";
import { db, deliveryZonesTable } from "@workspace/db";
import { ListDeliveryZonesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/delivery-zones", async (_req, res): Promise<void> => {
  const rows = await db.select().from(deliveryZonesTable).orderBy(deliveryZonesTable.fee);
  const normalized = rows.map((row) => ({ ...row, fee: Number(row.fee) }));
  res.json(ListDeliveryZonesResponse.parse(normalized));
});

export default router;
