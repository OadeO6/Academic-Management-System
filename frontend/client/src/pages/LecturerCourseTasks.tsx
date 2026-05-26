/**
 * Lecturer Course Tasks Page
 * Create, edit, and manage course assignments/tasks
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2, Edit, Loader2, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useLecturerCourseTasks, useCreateTask, useDeleteTask } from "@/api/hooks";
import { toast } from "sonner";
import type { Task, TaskQuestion, CreateTaskRequest } from "@/api/types";

export default function LecturerCourseTasks() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalPoints: 0,
    questions: [] as TaskQuestion[],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "mcq" as "mcq" | "free_text" | "document_upload",
    questionText: "",
    options: ["", ""],
    correctAnswer: "",
    maxScore: 0,
  });

  // Fetch tasks
  const { data: tasksData, isLoading, error, refetch } = useLecturerCourseTasks(Number(courseId));

  // Create task mutation
  const { mutate: createTask, isPending: isCreating } = useCreateTask({
    onSuccess: () => {
      toast.success("Task created successfully");
      setShowCreateDialog(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to create task");
    },
  });

  // Delete task mutation
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask({
    onSuccess: () => {
      toast.success("Task deleted successfully");
      setShowDeleteDialog(false);
      setSelectedTask(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete task");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      totalPoints: 0,
      questions: [],
    });
    setCurrentQuestion({
      type: "mcq",
      questionText: "",
      options: ["", ""],
      correctAnswer: "",
      maxScore: 0,
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.maxScore) {
      toast.error("Please fill in all question fields");
      return;
    }

    const newQuestion: TaskQuestion = {
      type: currentQuestion.type,
      questionText: currentQuestion.questionText,
      maxScore: currentQuestion.maxScore,
    };

    if (currentQuestion.type === "mcq") {
      newQuestion.options = currentQuestion.options.filter(o => o.trim());
      newQuestion.correctAnswer = currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "free_text") {
      newQuestion.correctAnswer = currentQuestion.correctAnswer;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });

    setCurrentQuestion({
      type: "mcq",
      questionText: "",
      options: ["", ""],
      correctAnswer: "",
      maxScore: 0,
    });

    toast.success("Question added");
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleCreateTask = () => {
    if (!formData.title || !formData.dueDate || !formData.totalPoints || formData.questions.length === 0) {
      toast.error("Please fill in all required fields and add at least one question");
      return;
    }

    createTask({
      courseOfferingId: Number(courseId),
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate),
      totalPoints: formData.totalPoints,
      questions: formData.questions,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedTask) return;

    deleteTask({
      courseOfferingId: Number(courseId),
      taskId: selectedTask.id,
    });
  };

  const tasks = tasksData?.tasks || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "published":
        return <Badge>Published</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isOverdue = (dueDate: Date) => new Date(dueDate) < new Date();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Tasks</h1>
            <p className="text-muted-foreground mt-2">Create and manage course assignments</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Course Task</DialogTitle>
                <DialogDescription>
                  Create a new assignment with questions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Task Details */}
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Task description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Due Date *</label>
                    <Input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Points *</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.totalPoints}
                      onChange={(e) => setFormData({ ...formData, totalPoints: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Questions</h3>

                  {/* Add Question Form */}
                  <div className="bg-muted p-4 rounded-lg space-y-3 mb-4">
                    <div>
                      <label className="text-sm font-medium">Question Type *</label>
                      <Select value={currentQuestion.type} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="free_text">Free Text</SelectItem>
                          <SelectItem value="document_upload">Document Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Question Text *</label>
                      <Textarea
                        placeholder="Enter question"
                        value={currentQuestion.questionText}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {currentQuestion.type === "mcq" && (
                      <div>
                        <label className="text-sm font-medium">Options *</label>
                        {currentQuestion.options.map((option, i) => (
                          <Input
                            key={i}
                            placeholder={`Option ${i + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[i] = e.target.value;
                              setCurrentQuestion({ ...currentQuestion, options: newOptions });
                            }}
                            className="mt-1"
                          />
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ""] })}
                        >
                          Add Option
                        </Button>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium">Max Score *</label>
                      <Input
                        type="number"
                        min="0"
                        value={currentQuestion.maxScore}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, maxScore: Number(e.target.value) })}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleAddQuestion}
                    >
                      Add Question
                    </Button>
                  </div>

                  {/* Questions List */}
                  {formData.questions.length > 0 && (
                    <div className="space-y-2">
                      {formData.questions.map((q, i) => (
                        <div key={i} className="p-3 border rounded-lg flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{q.questionText}</p>
                            <p className="text-xs text-muted-foreground">{q.type} - {q.maxScore} points</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveQuestion(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleCreateTask}
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load tasks"
            description="An error occurred while loading course tasks."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !tasks || tasks.length === 0 ? (
          <EmptyState
            title="No tasks created"
            description="Create your first course task to get started."
            icon={FileText}
          />
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{task.title}</h4>
                        {getStatusBadge(task.status)}
                        {isOverdue(task.dueDate) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span>{task.totalPoints} points</span>
                        <span>{task.questions.length} questions</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDeleteDialog(true);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
