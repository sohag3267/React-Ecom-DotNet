// API Configuration
import { API_CONFIG } from "@/lib/config/api.config";
import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/config/auth.config";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { isTokenExpired, shouldRefreshToken } from "@/lib/utils/security.utils";

// API Response Types
export interface ApiResponse<TResponse> {
  success: boolean;
  message?: string;
  data: TResponse | null;
  error: Error | null;
}

export interface PaginatedResponse<TResponse> {
  data: TResponse[] | null;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// HTTP Methods type
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Base API Client with fluent interface
export class ApiClient {
  private baseURL: string;
  private endpoint: string;
  private method: HttpMethod = "GET";
  private requestBody: BodyInit | null = null;
  private headers: Record<string, string> = {};
  private cache?: RequestCache;
  private cacheRevalidate?: number | false;
  private cacheTags?: string[];

  constructor(endpoint?: string) {
    this.baseURL = API_CONFIG.API_BASE_URL_V1;
    this.endpoint = this.normalizeEndpoint(endpoint || "");
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  // Helper method to normalize endpoint by removing leading/trailing slashes
  private normalizeEndpoint(endpoint: string): string {
    return endpoint.replace(/^\/+|\/+$/g, "");
  }

  // Static factory method to create a new instance with endpoint
  static create(endpoint: string): ApiClient {
    return new ApiClient(endpoint);
  }

  withMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  withCookieHeaders(cookies?: ReadonlyRequestCookies): this {
    if (cookies) {
      // Extract auth token from Next.js cookies
      const token = cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

      if (token) {
        // Store token for validation before execute()
        this.headers.Authorization = `Bearer ${token}`;
        this.headers["X-Auth-Token"] = token; // Store for validation in execute()
      }
    }

    return this;
  }

  withBody<TBody = unknown>(data: TBody): this {
    this.requestBody = JSON.stringify(data);
    this.headers["Content-Type"] = "application/json";
    return this;
  }

  withFormData(formData: FormData): this {
    this.requestBody = formData;
    // Remove Content-Type header to let browser set it with boundary
    delete this.headers["Content-Type"];
    return this;
  }

  withParams(
    params: Record<string, string | number | boolean | string[]>,
  ): this {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values by appending each item
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
      } else if (value !== undefined && value !== null) {
        // Handle single values
        searchParams.set(key, String(value));
      }
    });

    // Append query params to endpoint
    const queryString = searchParams.toString();
    if (queryString) {
      this.endpoint += this.endpoint.includes("?")
        ? `&${queryString}`
        : `?${queryString}`;
    }

    return this;
  }

  withHeaders(additionalHeaders: Record<string, string>): this {
    this.headers = { ...this.headers, ...additionalHeaders };
    return this;
  }

  withCache(
    tags: string[],
    revalidate?: number | false,
    cache?: RequestCache,
  ): this {
    this.cache = cache || "force-cache";
    this.cacheTags = tags;
    this.cacheRevalidate = revalidate;
    return this;
  }

  async execute<TResponse = unknown>(): Promise<TResponse> {
    // Check and refresh token if needed BEFORE making the request
    const authToken = this.headers["X-Auth-Token"];
    if (authToken) {
      try {
        // Check if token is expired
        if (isTokenExpired(authToken)) {
          throw new Error("TOKEN_EXPIRED");
        }

        // Check if token should be refreshed
        if (shouldRefreshToken(authToken)) {
          // Dynamically import to avoid circular dependency
          const { refreshToken } = await import("@/(app-routes)/(auth)/action");
          const refreshResult = await refreshToken();

          if (refreshResult.success && refreshResult.data?.token) {
            // Update Authorization header with new token
            this.headers.Authorization = `Bearer ${refreshResult.data.token}`;
          } else {
            // Refresh failed
            throw new Error("TOKEN_REFRESH_FAILED");
          }
        }
      } catch (error) {
        const errorMessage = (error as Error).message;

        if (
          errorMessage === "TOKEN_EXPIRED" ||
          errorMessage === "TOKEN_REFRESH_FAILED"
        ) {
          return {
            success: false,
            message:
              errorMessage === "TOKEN_EXPIRED"
                ? "Session expired. Please login again."
                : "Failed to refresh session. Please login again.",
            data: null,
            error: error as Error,
            needsLogin: true,
          } as TResponse;
        }
      }

      // Clean up temp header
      delete this.headers["X-Auth-Token"];
    }

    const url = `${this.baseURL}${this.endpoint ? "/" + this.endpoint : ""}`;

    const config: RequestInit = {
      method: this.method,
      headers: this.headers,
      body: this.requestBody,
      // Disable caching by default for external API calls
      // Only cache if explicitly set via withCache()
      cache: this.cache || "no-store",
      next: this.cacheTags
        ? {
            tags: this.cacheTags,
            revalidate: this.cacheRevalidate,
          }
        : undefined,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message || "Unknown error";
        errorResponse.message = errorMessage;
        errorResponse.error = new Error(errorMessage);

        return errorResponse;
      }

      return await response.json();
    } catch (error) {
      const errorMessage = (error as Error).message || "Network error";
      console.error("API request failed:", error);

      return {
        success: false,
        message: errorMessage,
        data: null,
        error: error as Error,
      } as TResponse;
    }
  }

  // Legacy methods for backward compatibility (deprecated)
  /** @deprecated Use ApiClient.create(endpoint).withMethod('GET').execute() instead */
  async get<TResponse>(endpoint: string): Promise<TResponse> {
    return ApiClient.create(endpoint)
      .withMethod("GET")
      .withCookieHeaders()
      .execute<TResponse>();
  }

  /** @deprecated Use ApiClient.create(endpoint).withMethod('POST').withBody(data).execute() instead */
  async post<TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
  ): Promise<TResponse> {
    const client = ApiClient.create(endpoint)
      .withMethod("POST")
      .withCookieHeaders();

    if (data) {
      client.withBody(data);
    }

    return client.execute<TResponse>();
  }

  /** @deprecated Use ApiClient.create(endpoint).withMethod('PUT').withBody(data).execute() instead */
  async put<TResponse, TBody = unknown>(
    endpoint: string,
    data?: TBody,
  ): Promise<TResponse> {
    const client = ApiClient.create(endpoint)
      .withMethod("PUT")
      .withCookieHeaders();

    if (data) {
      client.withBody(data);
    }

    return client.execute<TResponse>();
  }

  /** @deprecated Use ApiClient.create(endpoint).withMethod('DELETE').execute() instead */
  async delete<TResponse>(endpoint: string): Promise<TResponse> {
    return ApiClient.create(endpoint)
      .withMethod("DELETE")
      .withCookieHeaders()
      .execute<TResponse>();
  }
}
