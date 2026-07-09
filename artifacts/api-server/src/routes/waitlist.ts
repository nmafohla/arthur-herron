import { Router, type IRouter } from "express";
import { db, waitlistSignupsTable } from "@workspace/db";
import { CreateWaitlistSignupBody, CreateWaitlistSignupResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/waitlist", async (req, res): Promise<void> => {
  const parsed = CreateWaitlistSignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const [row] = await db
    .insert(waitlistSignupsTable)
    .values({
      fullName: parsed.data.fullName,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      interest: parsed.data.interest ?? null,
    })
    .returning();

  res.status(201).json(
    CreateWaitlistSignupResponse.parse({
      ...row,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    })
  );
});

export default router;
