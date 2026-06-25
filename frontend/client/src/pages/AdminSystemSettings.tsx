/**
 * AdminSystemSettings.tsx
 * System settings - backend integration pending
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { EmptyState } from "@/components/StateComponents";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      <EmptyState 
        title="No settings loaded" 
        description="Settings will appear here once backend is connected." 
      />
    </div>
  );
}
