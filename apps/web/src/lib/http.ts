export async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json();
  if (!res.ok) {
    const message = (json && (json.error || json.message)) ? (json.error || json.message) : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return json as T;
}
