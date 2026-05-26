/**
 * Student Course Materials Page
 * Displays course materials for a specific course
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Download, FileText, Video, Link as LinkIcon, Loader2, Calendar } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useCourseMaterials, useDownloadMaterial } from "@/api/hooks";
import { toast } from "sonner";
import type { CourseMaterialFilterParams } from "@/api/types";

export default function StudentMaterials() {
  const { user } = useAuth();
  const [, params] = useLocation();
  
  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");
  const [typeFilter, setTypeFilter] = useState<string>("");


  const materialFilterParams: CourseMaterialFilterParams = {
    type: (typeFilter as any) || undefined,
  };

  const { data: materials, isLoading, error, refetch } = useCourseMaterials(courseOfferingId);

  const downloadMutation = useDownloadMaterial();

  const handleDownload = (materialId: number, title: string) => {
    downloadMutation.mutate({ materialId, courseOfferingId });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "link":
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "link":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Course Materials</h1>
          <p className="text-muted-foreground mt-2">Download course materials and resources</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Materials List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load materials"
            description="An error occurred while loading course materials."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !materials || materials.length === 0 ? (
          <EmptyState
            title="No materials available"
            description="No course materials are available yet. Check back later."
            icon={FileText}
          />
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${getTypeColor(material.type)}`}>
                        {getTypeIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{material.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                          <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                            {material.visibility}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(material.id, material.title)}
                      disabled={downloadMutation.isPending}
                    >
                      {downloadMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    
  );
}
