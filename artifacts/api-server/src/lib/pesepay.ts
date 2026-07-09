import crypto from "node:crypto";

const INTEGRATION_KEY = process.env.PESEPAY_INTEGRATION_KEY ?? "";
const ENCRYPTION_KEY = process.env.PESEPAY_ENCRYPTION_KEY ?? "";

if (!INTEGRATION_KEY || !ENCRYPTION_KEY) {
  console.warn("[pesepay] PESEPAY_INTEGRATION_KEY / PESEPAY_ENCRYPTION_KEY are not set. Payments will fail.");
}

const IS_PRODUCTION = process.env.PESEPAY_MODE
  ? process.env.PESEPAY_MODE === "production"
  : process.env.NODE_ENV === "production";

const BASE_URL = IS_PRODUCTION
  ? "https://api.pesepay.com/api/payments-engine/v1/payments"
  : "https://api.test.sandbox.pesepay.com/payments-engine/v1/payments";

function encrypt(data: unknown): string {
  const iv = Buffer.from(ENCRYPTION_KEY.substring(0, 16), "utf8");
  const key = Buffer.from(ENCRYPTION_KEY, "utf8");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const json = JSON.stringify(data);
  let encrypted = cipher.update(json, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt<T = any>(encryptedBase64: string): T {
  const iv = Buffer.from(ENCRYPTION_KEY.substring(0, 16), "utf8");
  const key = Buffer.from(ENCRYPTION_KEY, "utf8");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

export interface PesepayTransaction {
  redirectUrl: string;
  referenceNumber: string;
  pollUrl: string;
  transactionStatus: string;
  [key: string]: unknown;
}

export async function initiateTransaction(params: {
  amount: number;
  currencyCode: string;
  reasonForPayment: string;
  resultUrl: string;
  returnUrl: string;
  merchantReference?: string;
}): Promise<PesepayTransaction> {
  const body = {
    amountDetails: {
      amount: params.amount,
      currencyCode: params.currencyCode,
    },
    reasonForPayment: params.reasonForPayment,
    resultUrl: params.resultUrl,
    returnUrl: params.returnUrl,
    merchantReference: params.merchantReference,
  };

  const encryptedPayload = encrypt(body);

  const response = await fetch(`${BASE_URL}/initiate`, {
    method: "POST",
    headers: {
      authorization: INTEGRATION_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({ payload: encryptedPayload }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Pesepay initiate failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as { payload: string };
  return decrypt<PesepayTransaction>(json.payload);
}

export async function checkPaymentStatus(referenceNumber: string): Promise<PesepayTransaction> {
  const response = await fetch(`${BASE_URL}/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`, {
    method: "GET",
    headers: {
      authorization: INTEGRATION_KEY,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Pesepay check-payment failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as { payload: string };
  return decrypt<PesepayTransaction>(json.payload);
}

export function decryptWebhookPayload(payload: string): PesepayTransaction {
  return decrypt<PesepayTransaction>(payload);
}

export function mapPesepayStatusToOrderStatus(transactionStatus: string): "pending_payment" | "confirmed" | "payment_failed" {
  const status = transactionStatus.toUpperCase();
  if (status === "SUCCESS" || status === "PAID") {
    return "confirmed";
  }
  if (status === "FAILED" || status === "CANCELLED" || status === "REVERSED" || status === "TIME_OUT") {
    return "payment_failed";
  }
  return "pending_payment";
}
