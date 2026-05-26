/**
 * Student Courses Page
 * Displays available courses for registration and enrolled courses
 * All data loaded from backend APIs
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BookOpen, Users, Calendar, FileText, Search, Filter, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useAvailableCourses, useCourseDetail, useRegisterCourse, useDropCourse, useRegisteredCourses } from "@/api/hooks";
import { toast } from "sonner";
import type { CourseFilterParams, RegisteredCourseFilterParams } from "@/api/types";

export default function StudentCourses() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // State for Available Courses
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDropConfirm, setShowDropConfirm] = useState(false);
  const [courseToDropId, setCourseToDropId] = useState<number | null>(null);

  // State for Registered Courses
  const [semesterFilter, setSemsesterFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");


  // Fetch available courses
  const availableCoursesParams: CourseFilterParams = {
    query: searchQuery || undefined,
    level: levelFilter ? parseInt(levelFilter) : undefined,
    departmentId: departmentFilter ? parseInt(departmentFilter) : undefined,
    page,
    limit: 10,
  };

  const { data: availableCoursesData, isLoading: isLoadingAvailable, error: errorAvailable, refetch: refetchAvailable } = useAvailableCourses(availableCoursesParams);

  // Fetch course details
  const { data: courseDetails, isLoading: isLoadingDetails } = useCourseDetail(selectedCourseId || 0);

  // Fetch registered courses
  const registeredCoursesParams: RegisteredCourseFilterParams = {
    status: (statusFilter as any) || undefined,
  };

  const { data: registeredCourses, isLoading: isLoadingRegistered, error: errorRegistered, refetch: refetchRegistered } = useRegisteredCourses(registeredCoursesParams);

  // Mutations
  const registerMutation = useRegisterCourse({
    onSuccess: () => {
      toast.success("Successfully registered for course!");
      refetchAvailable();
      refetchRegistered();
      setShowDetailDialog(false);
    },
    onError: (error) => {
      toast.error(`Failed to register: ${error.message}`);
    },
  });

  const dropMutation = useDropCourse({
    onSuccess: () => {
      toast.success("Successfully dropped course!");
      refetchRegistered();
      setShowDropConfirm(false);
    },
    onError: (error) => {
      toast.error(`Failed to drop course: ${error.message}`);
    },
  });

  const handleRegisterCourse = (courseOfferingId: number) => {
    registerMutation.mutate({ courseOfferingId });
  };

  const handleDropCourse = (courseOfferingId: number) => {
    setCourseToDropId(courseOfferingId);
    setShowDropConfirm(true);
  };

  const confirmDropCourse = () => {
    if (courseToDropId) {
      dropMutation.mutate({ courseOfferingId: courseToDropId });
    }
  };

  const handleViewDetails = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowDetailDialog(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setLevelFilter("");
    setDepartmentFilter("");
    setPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-2">Browse available courses and manage your enrollments</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Courses</TabsTrigger>
            <TabsTrigger value="registered">My Courses</TabsTrigger>
          </TabsList>

          {/* Available Courses Tab */}
          <TabsContent value="available" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Level Filter */}
                  <Select value={levelFilter} onValueChange={(value) => {
                    setLevelFilter(value);
                    setPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Department Filter */}
                  <Select value={departmentFilter} onValueChange={(value) => {
                    setDepartmentFilter(value);
                    setPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="1">Computer Science</SelectItem>
                      <SelectItem value="2">Mathematics</SelectItem>
                      <SelectItem value="3">Physics</SelectItem>
                      <SelectItem value="4">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Button */}
                {(searchQuery || levelFilter || departmentFilter) && (
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Courses List */}
            {isLoadingAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : errorAvailable ? (
              <ErrorState
                title="Failed to load courses"
                description="An error occurred while loading available courses."
                error={errorAvailable}
                onRetry={() => refetchAvailable()}
              />
            ) : !availableCoursesData?.courses || availableCoursesData.courses.length === 0 ? (
              <EmptyState
                title="No courses available"
                description="No courses match your search criteria. Try adjusting your filters."
                icon={BookOpen}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCoursesData.courses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.definition?.title || "Untitled Course"}</CardTitle>
                            <CardDescription>{course.definition?.code || "N/A"}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.definition?.description || "No description available"}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Credits</p>
                            <p className="font-semibold">{course.definition?.creditUnits || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Enrollment</p>
                            <p className="font-semibold">{course.currentEnrollment}/{course.maxCapacity}</p>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleViewDetails(course.id)}
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {availableCoursesData && availableCoursesData.totalCount > 10 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, availableCoursesData.totalCount)} of {availableCoursesData.totalCount} courses
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
                        disabled={page * 10 >= availableCoursesData.totalCount}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Registered Courses Tab */}
          <TabsContent value="registered" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Semester Filter */}
                  <Select value={semesterFilter} onValueChange={setSemsesterFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Semesters</SelectItem>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Registered Courses List */}
            {isLoadingRegistered ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : errorRegistered ? (
              <ErrorState
                title="Failed to load courses"
                description="An error occurred while loading your registered courses."
                error={errorRegistered}
                onRetry={() => refetchRegistered()}
              />
            ) : !registeredCourses || !Array.isArray(registeredCourses) || registeredCourses.length === 0 ? (
              <EmptyState
                title="No registered courses"
                description="You haven't registered for any courses yet. Browse available courses to get started."
                icon={BookOpen}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(registeredCourses) && registeredCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{enrollment.course?.definition?.title || "Untitled Course"}</CardTitle>
                          <CardDescription>{enrollment.course?.definition?.code || "N/A"}</CardDescription>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                          enrollment.status === 'dropped' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Lecturer</p>
                          <p className="font-semibold">{enrollment.course?.lecturer?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Credits</p>
                          <p className="font-semibold">{enrollment.course?.definition?.creditUnits || 0}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(`/student/courses/${enrollment.courseOfferingId}`)}
                        >
                          View Course
                        </Button>
                        {enrollment.status === 'active' && (
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleDropCourse(enrollment.courseOfferingId)}
                            disabled={dropMutation.isPending}
                          >
                            {dropMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Dropping...
                              </>
                            ) : (
                              "Drop Course"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              Review course information and registration details
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : courseDetails ? (
            <div className="space-y-6">
              {/* Course Header */}
              <div>
                <h3 className="text-2xl font-bold">{courseDetails.title}</h3>
                <p className="text-muted-foreground">{courseDetails.code}</p>
              </div>

              {/* Course Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lecturer</p>
                  <p className="font-semibold">{courseDetails.lecturer?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits</p>
                  <p className="font-semibold">{courseDetails.definition?.creditUnits || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Enrollment</p>
                  <p className="font-semibold">{courseDetails.currentEnrollment}/{courseDetails.maxCapacity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{courseDetails.status}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">
                  {courseDetails.definition?.description || "No description available"}
                </p>
              </div>

              {/* Registration Status */}
              {courseDetails.registrationStatus && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Registration Status: </span>
                    <span className="font-semibold capitalize">{courseDetails.registrationStatus}</span>
                  </p>
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full"
                onClick={() => handleRegisterCourse(courseDetails.id)}
                disabled={registerMutation.isPending || courseDetails.registrationStatus === 'registered'}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : courseDetails.registrationStatus === 'registered' ? (
                  "Already Registered"
                ) : (
                  "Register for Course"
                )}
              </Button>
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

      {/* Drop Course Confirmation Dialog */}
      <AlertDialog open={showDropConfirm} onOpenChange={setShowDropConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Drop Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to drop this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDropCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Drop Course
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
