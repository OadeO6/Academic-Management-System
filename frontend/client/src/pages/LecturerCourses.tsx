/**
 * Lecturer Assigned Courses Page
 * Displays courses assigned to the lecturer
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Users, FileText, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useLecturerCourses, useLecturerCourseDetail } from "@/api/hooks";
import type { LecturerCourseFilterParams } from "@/api/types";

export default function LecturerCourses() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);


  const filterParams: LecturerCourseFilterParams = {
    query: searchQuery || undefined,
    page: 1,
    limit: 20,
  };

  // Fetch courses
  const { data: coursesData, isLoading, error, refetch } = useLecturerCourses(filterParams);

  // Fetch course detail
  const { data: courseDetail, isLoading: isLoadingDetail } = useLecturerCourseDetail(selectedCourseId || 0);

  const courses = coursesData?.courses || [];

  const handleViewDetails = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowDetailDialog(true);
  };

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-2">Manage your assigned courses and course materials</p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by course name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Courses List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load courses"
            description="An error occurred while loading your courses."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !courses || courses.length === 0 ? (
          <EmptyState
            title="No courses assigned"
            description="You have no courses assigned yet."
            icon={BookOpen}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <Badge variant={course.active ? "default" : "secondary"}>
                          {course.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{course.totalStudents} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{course.sessionsCount} Sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{course.tasksCount} Tasks</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              View course information and statistics
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : courseDetail ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">{courseDetail.title}</h3>
                <p className="text-muted-foreground mt-1">{courseDetail.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{courseDetail.totalStudents}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{courseDetail.level}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold">{courseDetail.sessionsCount}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="text-2xl font-bold">{courseDetail.tasksCount}</p>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-2" variant={courseDetail.active ? "default" : "secondary"}>
                  {courseDetail.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Course not found"
              description="Unable to load course details"
              icon={BookOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}
