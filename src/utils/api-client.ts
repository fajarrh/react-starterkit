type RequestInterceptor = (
  config: RequestInit & { url: string },
) => RequestInit & { url: string };
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: unknown) => unknown;

interface InterceptorPair<T, E = ErrorInterceptor> {
  onFulfilled?: T;
  onRejected?: E;
}

interface ClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export default class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private requestInterceptors: InterceptorPair<RequestInterceptor>[] = [];
  private responseInterceptors: InterceptorPair<ResponseInterceptor>[] = [];

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // trim trailing slash
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  // ─── Interceptor API ───────────────────────────────────────────────────────

  interceptors = {
    request: {
      use: (
        onFulfilled?: RequestInterceptor,
        onRejected?: ErrorInterceptor,
      ) => {
        this.requestInterceptors.push({ onFulfilled, onRejected });
      },
    },
    response: {
      use: (
        onFulfilled?: ResponseInterceptor,
        onRejected?: ErrorInterceptor,
      ) => {
        this.responseInterceptors.push({ onFulfilled, onRejected });
      },
    },
  };

  // ─── Core fetch ───────────────────────────────────────────────────────────

  private buildUrl(endpoint: string, params: Record<string, unknown> = {}): string {
    const url = `${this.baseUrl}${endpoint}`;
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    );
    if (entries.length === 0) return url;
    const qs = new URLSearchParams(
      entries.map(([k, v]) => [k, String(v)]),
    ).toString();
    return `${url}?${qs}`;
  }

  private async request<T = unknown>(
    endpoint: string,
    init: RequestInit & { params?: Record<string, unknown> } = {},
  ): Promise<T> {
    const { params = {}, ...restInit } = init;
    let config: RequestInit & { url: string } = {
      ...restInit,
      url: this.buildUrl(endpoint, params),
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(init.headers as Record<string, string>),
      },
    };

    // Run request interceptors
    for (const interceptor of this.requestInterceptors) {
      try {
        if (interceptor.onFulfilled) {
          config = interceptor.onFulfilled(config);
        }
      } catch (err) {
        if (interceptor.onRejected) interceptor.onRejected(err);
        throw err;
      }
    }

    const { url, ...fetchInit } = config;

    let response: Response;
    try {
      response = await fetch(url, fetchInit);
    } catch (err) {
      throw err;
    }

    // Run response interceptors
    for (const interceptor of this.responseInterceptors) {
      try {
        if (interceptor.onFulfilled) {
          response = await interceptor.onFulfilled(response);
        }
      } catch (err) {
        if (interceptor.onRejected) interceptor.onRejected(err);
        throw err;
      }
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `[Client] ${response.status} ${response.statusText}: ${errorBody}`,
      );
    }

    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return response.text() as unknown as T;
  }

  // ─── HTTP Methods ─────────────────────────────────────────────────────────

  get<T = unknown>(endpoint: string, init?: RequestInit & { params?: Record<string, unknown> }) {
    return this.request<T>(endpoint, { ...init, method: "GET" });
  }

  post<T = unknown>(endpoint: string, body?: unknown, init?: RequestInit & { params?: Record<string, unknown> }) {
    return this.request<T>(endpoint, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T = unknown>(endpoint: string, body?: unknown, init?: RequestInit & { params?: Record<string, unknown> }) {
    return this.request<T>(endpoint, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T = unknown>(endpoint: string, body?: unknown, init?: RequestInit & { params?: Record<string, unknown> }) {
    return this.request<T>(endpoint, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T = unknown>(endpoint: string, init?: RequestInit & { params?: Record<string, unknown> }) {
    return this.request<T>(endpoint, { ...init, method: "DELETE" });
  }
}
