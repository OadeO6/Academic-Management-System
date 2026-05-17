/**
 * Reusable State Components
 * LoadingState, EmptyState, ErrorState, and SkeletonLoader
 * Used across all pages to handle different UI states
 */

import { AlertCircle, RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * LoadingState Component
 * Shows a loading skeleton while data is being fetched
 */
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * EmptyState Component
 * Shows when there's no data to display
 */
export function EmptyState({
  title = "No data available",
  description = "There's nothing to show here yet.",
  icon: Icon = Inbox,
  action,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <Icon className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-center">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * ErrorState Component
 * Shows when an API error occurs
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading the data. Please try again.",
  onRetry,
  error,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  error?: Error | string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <AlertCircle className="h-16 w-16 text-destructive/40 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-2 max-w-sm text-center">{description}</p>
      {error && (
        <p className="text-xs text-muted-foreground mb-6 max-w-sm text-center bg-muted p-3 rounded">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

/**
 * ApiUnavailableState Component
 * Shows when the backend API is not available
 */
export function ApiUnavailableState({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <AlertCircle className="h-16 w-16 text-warning/40 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">API Unavailable</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-center">
        The backend API is not available. Please ensure the backend server is running and try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}

/**
 * SkeletonLoader Component
 * Shows a skeleton loading state for list items
 */
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-muted rounded-lg h-24 animate-pulse" />
      ))}
    </div>
  );
}

/**
 * SkeletonCard Component
 * Shows a skeleton loading state for card items
 */
export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-muted-foreground/20 rounded mb-4" />
          <div className="h-8 bg-muted-foreground/20 rounded mb-4" />
          <div className="h-4 bg-muted-foreground/20 rounded" />
        </div>
      ))}
    </div>
  );
}
