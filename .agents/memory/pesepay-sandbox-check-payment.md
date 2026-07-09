---
name: Pesepay sandbox check-payment decrypt failure
description: The Pesepay sandbox check-payment (poll) endpoint returns payloads that fail AES-256-CBC decryption even with the correct integration/encryption key, unlike initiate which decrypts fine.
---

Pesepay's REST API encrypts request/response bodies with AES-256-CBC (key = encryption key as UTF-8 bytes, IV = first 16 chars of the same key). This works reliably for `POST /payments/initiate` and (presumably) the webhook `resultUrl` callback.

`GET /payments/check-payment?referenceNumber=...` in the **sandbox** environment consistently returns a `payload` that fails to decrypt with the standard key/IV (`ERR_OSSL_BAD_DECRYPT`), even immediately after a fresh `initiate` call using the same key. Tried and ruled out: zero-filled IV, plain (unencrypted) base64 JSON, alternate key encodings (hex/latin1/base64) — none decrypt successfully. This reproduces with both a hand-rolled implementation and the official `pesepay` npm SDK's algorithm, so it is not an implementation bug — it appears to be a sandbox-side inconsistency.

**Why this matters:** Building a payment status poller around `check-payment` will intermittently/always 502 in sandbox, breaking the UI if errors are surfaced directly.

**How to apply:** Treat the `resultUrl` webhook POST as the authoritative source of payment status updates. Make any `check-payment` polling route fail soft — on decrypt/request failure, return the order's last-known stored status instead of an error, and let the webhook (or manual admin override) be what actually flips the order to confirmed/failed. Re-verify against production Pesepay before assuming this is fixed there.
