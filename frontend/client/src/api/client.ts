/**
 * API Client Configuration
 * 
 * Centralized API client setup with:
 * - Environment-based URLs
 * - Request/response interceptors
 * - Error handling
 * - Auth token injection
 * - Timeout configuration
 */

import { TRPCClientError } from "@trpc/client";
import type { APIError } from "./types";

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Base URLs - environment-based
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TRPC_URL: import.meta.env.VITE_TRPC_URL || "http://localhost:3000/api/trpc",
  
  // Timeouts (in milliseconds)
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 120000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Cache configuration
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 1 * 60 * 1000, // 1 minute
};

/**
 * API Error Handler
 * 
 * Transforms API errors into user-friendly messages
 */
export class APIErrorHandler {
  static handle(error: unknown): APIError {
    // Handle tRPC errors
    if (error instanceof TRPCClientError) {
      return {
        code: error.data?.code || "UNKNOWN_ERROR",
        message: error.message || "An unexpected error occurred",
        details: error.data,
        timestamp: new Date(),
      };
    }

    // Handle fetch errors
    if (error instanceof Error) {
      return {
        code: "FETCH_ERROR",
        message: error.message,
        timestamp: new Date(),
      };
    }

    // Handle unknown errors
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
      timestamp: new Date(),
    };
  }

  static getMessageForUser(error: APIError): string {
    const messages: Record<string, string> = {
      UNAUTHORIZED: "Please log in to continue",
      FORBIDDEN: "You don't have permission to access this resource",
      NOT_FOUND: "The requested resource was not found",
      VALIDATION_ERROR: "Please check your input and try again",
      SERVER_ERROR: "A server error occurred. Please try again later",
      NETWORK_ERROR: "Network error. Please check your connection",
      TIMEOUT: "Request timed out. Please try again",
      UNKNOWN_ERROR: "An unexpected error occurred",
    };

    return messages[error.code] || error.message;
  }

  static isRetryable(error: APIError): boolean {
    const retryableCodes = [
      "NETWORK_ERROR",
      "TIMEOUT",
      "SERVER_ERROR",
      "SERVICE_UNAVAILABLE",
    ];
    return retryableCodes.includes(error.code);
  }
}

/**
 * Request Interceptor
 * 
 * Adds auth token and other headers to requests
 */
export function createRequestInterceptor() {
  return (init: RequestInit = {}): RequestInit => {
    const headers = new Headers(init.headers);

    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Add content type
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Add request ID for tracing
    headers.set("X-Request-ID", generateRequestId());

    return {
      ...init,
      headers,
    };
  };
}

/**
 * Response Interceptor
 * 
 * Handles response transformation and error handling
 */
export async function createResponseInterceptor(
  response: Response
): Promise<Response> {
  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Clear auth token and redirect to login
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    console.error("Access forbidden");
  }

  // Handle 5xx errors
  if (response.status >= 500) {
    console.error(`Server error: ${response.status}`);
  }

  return response;
}

/**
 * Retry Logic
 * 
 * Implements exponential backoff retry strategy
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = API_CONFIG.MAX_RETRIES,
  delayMs = API_CONFIG.RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      const apiError = APIErrorHandler.handle(error);
      if (!APIErrorHandler.isRetryable(apiError)) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = API_CONFIG.REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * API Client Factory
 * 
 * Creates a configured fetch client with interceptors
 */
export function createAPIClient() {
  const requestInterceptor = createRequestInterceptor();

  return {
    async get<T>(url: string, init?: RequestInit): Promise<T> {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${url}`,
        requestInterceptor({ ...init, method: "GET" })
      );

      await createResponseInterceptor(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },

    async post<T>(url: string, data?: unknown, init?: RequestInit): Promise<T> {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${url}`,
        requestInterceptor({
          ...init,
          method: "POST",
          body: data ? JSON.stringify(data) : undefined,
        })
      );

      await createResponseInterceptor(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },

    async put<T>(url: string, data?: unknown, init?: RequestInit): Promise<T> {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${url}`,
        requestInterceptor({
          ...init,
          method: "PUT",
          body: data ? JSON.stringify(data) : undefined,
        })
      );

      await createResponseInterceptor(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },

    async delete<T>(url: string, init?: RequestInit): Promise<T> {
      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${url}`,
        requestInterceptor({ ...init, method: "DELETE" })
      );

      await createResponseInterceptor(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },

    async upload<T>(
      url: string,
      file: File,
      init?: RequestInit
    ): Promise<T> {
      const formData = new FormData();
      formData.append("file", file);

      const headers = new Headers(init?.headers);
      // Don't set Content-Type for FormData - browser will set it with boundary
      headers.delete("Content-Type");

      const response = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${url}`,
        {
          ...init,
          method: "POST",
          headers,
          body: formData,
        },
        API_CONFIG.UPLOAD_TIMEOUT
      );

      await createResponseInterceptor(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
  };
}

/**
 * Singleton API Client Instance
 */
export const apiClient = createAPIClient();
