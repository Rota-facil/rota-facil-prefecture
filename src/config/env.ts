function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isInternalServiceUrl(url: URL): boolean {
  return url.port === "8087" || /^[a-f0-9]{12}$/i.test(url.hostname);
}

function getBrowserGatewayBaseUrl(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.protocol}//${window.location.hostname}:8080`;
}

function normalizeGatewayBaseUrl(value?: string): string {
  if (!value) {
    return getBrowserGatewayBaseUrl() ?? "http://localhost:8080";
  }

  try {
    const url = new URL(value);
    if (isInternalServiceUrl(url)) {
      return getBrowserGatewayBaseUrl() ?? "http://localhost:8080";
    }

    return stripTrailingSlash(value);
  } catch {
    return getBrowserGatewayBaseUrl() ?? "http://localhost:8080";
  }
}

function resolveGrafanaUrl(value?: string): string {
  if (value) {
    return stripTrailingSlash(value);
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return "http://localhost:3000";
}

export const env = {
  WEB_BASE_URL: normalizeGatewayBaseUrl(process.env.NEXT_PUBLIC_WEB_BASE_URL),
  GRAFANA_URL: process.env.NEXT_PUBLIC_GRAFANA_URL,
  GOOGLE_LOGIN_PREFECTURE_URL:
    process.env.NEXT_PUBLIC_GOOGLE_LOGIN_PREFECTURE_URL,
};

export function getGrafanaUrl(): string {
  return resolveGrafanaUrl(env.GRAFANA_URL);
}
