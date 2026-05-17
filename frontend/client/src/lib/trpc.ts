/**
 * tRPC Client Configuration
 * Frontend-only tRPC client setup for API integration
 * 
 * The backend router type is defined by the backend team
 * This client will be connected to the real backend APIs
 */

import { createTRPCReact } from "@trpc/react-query";

// Type placeholder - will be replaced with actual backend router type
// when backend integration is complete
export const trpc = createTRPCReact<any>();

/**
 * API Configuration
 * These constants define the API endpoints and configuration
 * Update these values based on your backend deployment
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TRPC_URL: import.meta.env.VITE_TRPC_URL || "http://localhost:3000/api/trpc",
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
