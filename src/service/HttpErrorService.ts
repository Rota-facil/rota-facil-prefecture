import { toast } from "sonner";

type BackendErrorBody = {
  message?: unknown;
  detail?: unknown;
  error?: unknown;
  errors?: unknown;
  title?: unknown;
};

function stringifyMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  if (Array.isArray(value)) {
    const messages = value.map(stringifyMessage).filter(Boolean);
    return messages.length > 0 ? messages.join("\n") : undefined;
  }

  if (value && typeof value === "object") {
    const messages = Object.entries(value as Record<string, unknown>)
      .map(([field, fieldMessage]) => {
        const message = stringifyMessage(fieldMessage);
        return message ? `${field}: ${message}` : undefined;
      })
      .filter(Boolean);

    return messages.length > 0 ? messages.join("\n") : undefined;
  }

  return undefined;
}

async function readBackendError(
  response: Response,
): Promise<string | undefined> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as BackendErrorBody;
      return (
        stringifyMessage(body.message) ??
        stringifyMessage(body.detail) ??
        stringifyMessage(body.errors) ??
        stringifyMessage(body.error) ??
        stringifyMessage(body.title)
      );
    } catch {
      return undefined;
    }
  }

  try {
    const text = await response.text();
    return text.trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function handleHttpError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  const message = (await readBackendError(response)) ?? fallbackMessage;
  toast.error(message);

  throw new Error(message);
}
