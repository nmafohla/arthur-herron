import { and, eq, sql } from "drizzle-orm";
import { db, ordersTable, usersTable } from "@workspace/db";

export const POINTS_PER_DOLLAR = 10;

type MinimalLogger = { info?: (obj: unknown, msg?: string) => void };

/**
 * Award loyalty points for an order that has just been confirmed. Idempotent:
 * uses a conditional update on `pointsAwarded` so concurrent status polls and
 * webhooks cannot double-award. Only orders tied to a signed-in user earn points.
 */
export async function awardPointsForConfirmedOrder(
  orderId: number,
  log?: MinimalLogger,
): Promise<void> {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order || order.status !== "confirmed" || !order.userId || order.pointsAwarded) {
    return;
  }

  const points = Math.floor(Number(order.total) * POINTS_PER_DOLLAR);

  // Atomically claim the award so racing callers don't both credit points.
  const claimed = await db
    .update(ordersTable)
    .set({ pointsAwarded: true })
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.pointsAwarded, false)))
    .returning({ id: ordersTable.id });
  if (claimed.length === 0) return;

  // Ensure a user row exists (order creation provisions it, but be defensive).
  await db.insert(usersTable).values({ id: order.userId }).onConflictDoNothing();

  await db
    .update(usersTable)
    .set({ loyaltyPoints: sql`${usersTable.loyaltyPoints} + ${points}` })
    .where(eq(usersTable.id, order.userId));

  log?.info?.({ orderId, points, userId: order.userId }, "Loyalty points awarded");
}
