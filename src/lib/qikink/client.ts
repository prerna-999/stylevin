// Server-only. Never import this into a client component.

interface TokenCache {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cache: TokenCache | null = null;

const BASE_URL = process.env.QIKINK_BASE_URL as string;
const CLIENT_ID = process.env.QIKINK_CLIENT_ID as string;
const CLIENT_SECRET = process.env.QIKINK_CLIENT_SECRET as string;

/**
 * Returns a valid access_token, reusing the cached one until it's close
 * to expiring. Confirm the exact token endpoint path + response shape
 * against your Postman collection (Integration -> Custom API) and
 * adjust the fetch below if it differs.
 */
export async function getQikinkAccessToken(): Promise<string> {
  const now = Date.now();

  if (cache && cache.expiresAt > now + 30_000) {
    return cache.accessToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !BASE_URL) {
    throw new Error(
      "Missing Qikink env vars: QIKINK_CLIENT_ID / QIKINK_CLIENT_SECRET / QIKINK_BASE_URL"
    );
  }

  // TODO: confirm this path against your dashboard's Postman collection.
  // Common pattern for this API style is POST {BASE_URL}/api/token
  //
  // NOTE: sent as multipart/form-data, not JSON. Many of these dashboard
  // APIs only read $_POST form fields and silently ignore JSON bodies —
  // that's what was causing the "ClientId or client_secret are Missing"
  // error even though the values were being sent.
  const form = new FormData();
  form.append("ClientId", CLIENT_ID);
  form.append("client_secret", CLIENT_SECRET);

  const res = await fetch(`${BASE_URL}/api/token`, {
    method: "POST",
    body: form,
    // Do NOT set Content-Type manually here — fetch sets the correct
    // multipart boundary automatically when body is a FormData instance.
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qikink token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Confirmed from live response: Qikink returns the token under
  // "Accesstoken" (one word, capital A).
  const accessToken: string = data.Accesstoken;
  const expiresInSeconds: number = data.expires_in ?? 3600; // fallback 1hr

  if (!accessToken) {
    throw new Error(
      `Qikink token response missing access token: ${JSON.stringify(data)}`
    );
  }

  cache = {
    accessToken,
    expiresAt: now + expiresInSeconds * 1000,
  };

  return accessToken;
}

/**
 * Generic authenticated request helper for any Qikink endpoint.
 * Usage: qikinkRequest("/api/order/create", { method: "POST", body: {...} })
 */
export async function qikinkRequest<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = await getQikinkAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ClientId: CLIENT_ID,
      Accesstoken: token,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qikink request to ${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}