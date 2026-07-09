import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  InitiatePesepayPaymentBody,
  InitiatePesepayPaymentResponse,
  GetPesepayStatusParams,
  GetPesepayStatusResponse,
  PesepayResultWebhookBody,
} from "@workspace/api-zod";
import {
  initiateTransaction,
  checkPaymentStatus,
  decryptWebhookPayload,
  mapPesepayStatusToOrderStatus,
} from "../lib/pesepay";
import { awardPointsForConfirmedOrder } from "../lib/points";

const router: IRouter = Router();

function getOrigin(req: { protocol: string; get: (name: string) => string | undefined }): string {
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/payments/pesepay/initiate", async (req, res): Promise<void> => {
  const parsed = InitiatePesepayPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.orderNumber, parsed.data.orderNumber));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const origin = getOrigin(req);

  try {
    const transaction = await initiateTransaction({
      amount: Number(order.total),
      currencyCode: "USD",
      reasonForPayment: `Arthur Herron order #${order.orderNumber}`,
      resultUrl: `${origin}/api/payments/pesepay/result`,
      returnUrl: `${origin}/order-confirmation/${order.orderNumber}`,
      merchantReference: order.orderNumber,
    });

    await db
      .update(ordersTable)
      .set({
        paymentReferenceNumber: transaction.referenceNumber,
        paymentPollUrl: transaction.pollUrl,
      })
      .where(eq(ordersTable.id, order.id));

    res.json(
      InitiatePesepayPaymentResponse.parse({
        redirectUrl: transaction.redirectUrl,
        referenceNumber: transaction.referenceNumber,
      }),
    );
  } catch (err) {
    req.log.error({ err }, "Pesepay initiate failed");
    res.status(502).json({ error: "Failed to initiate payment with Pesepay" });
  }
});

router.get("/payments/pesepay/status/:orderNumber", async (req, res): Promise<void> => {
  const params = GetPesepayStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.orderNumber, params.data.orderNumber));
  if (!order || !order.paymentReferenceNumber) {
    res.status(404).json({ error: "Order or payment not found" });
    return;
  }

  try {
    const transaction = await checkPaymentStatus(order.paymentReferenceNumber);
    const orderStatus = mapPesepayStatusToOrderStatus(transaction.transactionStatus);

    if (orderStatus !== order.status) {
      await db.update(ordersTable).set({ status: orderStatus }).where(eq(ordersTable.id, order.id));
    }

    if (orderStatus === "confirmed") {
      await awardPointsForConfirmedOrder(order.id, req.log);
    }

    res.json(
      GetPesepayStatusResponse.parse({
        status: transaction.transactionStatus,
        orderStatus,
      }),
    );
  } catch (err) {
    // Pesepay's check-payment endpoint can be unreliable; the authoritative status update
    // arrives via the /payments/pesepay/result webhook. Fall back to the order's current
    // status instead of surfacing an error so the frontend keeps polling quietly.
    req.log.warn({ err }, "Pesepay status check failed, falling back to stored order status");
    res.json(
      GetPesepayStatusResponse.parse({
        status: order.status,
        orderStatus: order.status,
      }),
    );
  }
});

router.post("/payments/pesepay/result", async (req, res): Promise<void> => {
  const parsed = PesepayResultWebhookBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid Pesepay webhook payload");
    res.status(200).json({ received: true });
    return;
  }

  try {
    const transaction = decryptWebhookPayload(parsed.data.payload);
    const referenceNumber = transaction.referenceNumber as string | undefined;
    if (!referenceNumber) {
      res.status(200).json({ received: true });
      return;
    }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.paymentReferenceNumber, referenceNumber));
    if (order) {
      const orderStatus = mapPesepayStatusToOrderStatus(String(transaction.transactionStatus));
      await db.update(ordersTable).set({ status: orderStatus }).where(eq(ordersTable.id, order.id));
      if (orderStatus === "confirmed") {
        await awardPointsForConfirmedOrder(order.id, req.log);
      }
      req.log.info({ orderNumber: order.orderNumber, orderStatus }, "Pesepay webhook processed");
    }
  } catch (err) {
    req.log.error({ err }, "Failed to process Pesepay webhook");
  }

  res.status(200).json({ received: true });
});

export default router;
