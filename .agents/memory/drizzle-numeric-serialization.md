---
name: Drizzle numeric column serialization
description: Postgres numeric/decimal columns come back as JS strings from drizzle-orm; must be coerced to Number (and Date fields to ISO strings) before validating/serializing with Zod response schemas generated from OpenAPI specs.
---

Postgres `numeric`/`decimal` columns are returned as strings by `drizzle-orm`, and `timestamp` columns are returned as native `Date` objects. If an OpenAPI-generated Zod response schema types a field as `number` or `string` (date), passing the raw drizzle row through `.parse()` will throw a `ZodError` (e.g. "Expected number, received string" or "Expected string, received date").

**Why:** This caused two separate 500 errors in production API routes (products/stats price fields as strings, and order `createdAt` as a Date) that only surfaced when actually calling the endpoints — typecheck and build passed fine since the Drizzle-inferred select types matched runtime values structurally.

**How to apply:** In any Express route that selects numeric or timestamp columns and validates the response with a generated Zod schema, explicitly normalize before `.parse()`:
- `price: Number(row.price)`, `oldPrice: row.oldPrice !== null ? Number(row.oldPrice) : null`
- `createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt`

Catch this class of bug early by actually calling the endpoint (curl or e2e test) rather than relying on typecheck alone.
