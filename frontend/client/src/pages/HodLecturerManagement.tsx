/**
 * HOD Lecturer Management Page
 * Manage lecturer records and view assignments
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, ChevronRight, Loader2, Badge } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useHODLecturers, useHODLecturerDetail } from "@/api/hooks";
import { toast } from "sonner";
import type { LecturerFilterParams } from "@/api/types";

export default function HodLecturerManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);


  const filterParams: LecturerFilterParams = {
    query: searchQuery || undefined,
    page,
    limit: 10,
  };

  const { data: lecturers, isLoading, error, refetch } = useHODLecturers(filterParams);
  const { data: lecturerDetail, isLoading: isLoadingDetail } = useHODLecturerDetail(selectedLecturerId || 0);

  const handleViewDetails = (lecturerId: number) => {
    setSelectedLecturerId(lecturerId);
    setShowDetailDialog(true);
  };

  const getAuthStatusColor = (status: string) => {
    switch (status) {
      case "authorized":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const lecturersList = Array.isArray(lecturers) ? lecturers : [];

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Lecturer Management</h1>
          <p className="text-muted-foreground mt-2">Manage lecturer records and assignments</p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Lecturers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, staff ID, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lecturers List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load lecturers"
            description="An error occurred while loading lecturer records."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !lecturersList || lecturersList.length === 0 ? (
          <EmptyState
            title="No lecturers found"
            description="No lecturer records match your search criteria."
            icon={Users}
          />
        ) : (
          <div className="space-y-3">
            {lecturersList.map((lecturer: any) => (
              <Card key={lecturer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{lecturer.fullName}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Staff ID</p>
                          <p className="font-medium">{lecturer.staffId}</p>
                        </div>
                        <div>
                          <p className="text-xs">Email</p>
                          <p className="font-medium">{lecturer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs">Department</p>
                          <p className="font-medium">{lecturer.department}</p>
                        </div>
                        <div>
                          <p className="text-xs">Authorization Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAuthStatusColor(lecturer.authorizationStatus)}`}>
                            {lecturer.authorizationStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(lecturer.id)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lecturersList.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing page {page}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lecturer Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lecturer Details</DialogTitle>
            <DialogDescription>
              View complete lecturer information and assigned courses
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : lecturerDetail ? (
            <div className="space-y-6">
              {/* Lecturer Info */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{lecturerDetail.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Staff ID</p>
                    <p className="font-semibold">{lecturerDetail.staffId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{lecturerDetail.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{lecturerDetail.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Authorization Status</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium mt-1 ${getAuthStatusColor(lecturerDetail.authorizationStatus)}`}>
                      {lecturerDetail.authorizationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Offerings */}
              <div>
                <h3 className="font-semibold mb-3">Assigned Courses</h3>
                {lecturerDetail.assignedOfferings && lecturerDetail.assignedOfferings.length > 0 ? (
                  <div className="space-y-2">
                    {lecturerDetail.assignedOfferings.map((offering: any) => (
                      <div key={offering.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{offering.courseTitle}</p>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-sm text-muted-foreground">
                          <p>Code: {offering.code}</p>
                          <p>Semester: {offering.semester}</p>
                          <p>Session: {offering.academicSession}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No assigned courses</p>
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Lecturer not found"
              description="Unable to load lecturer details"
              icon={Users}
            />
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}
