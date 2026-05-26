import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/StateComponents";
import { Construction } from "lucide-react";

interface ScaffoldPageProps {
  title: string;
  description: string;
}

export default function ScaffoldPage({ title, description }: ScaffoldPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="border-dashed bg-muted/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Feature Under Construction</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="Coming Soon" 
            description="We are working hard to bring this feature to you. Please check back later."
          />
        </CardContent>
      </Card>
    </div>
  );
}
