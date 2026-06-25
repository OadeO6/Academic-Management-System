/**
 * AdminDashboard.tsx
 * Admin dashboard - backend integration pending
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { EmptyState } from "@/components/StateComponents";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <EmptyState 
        title="Dashboard" 
        description="Dashboard will appear here once backend is connected." 
      />
    </div>
  );
}
