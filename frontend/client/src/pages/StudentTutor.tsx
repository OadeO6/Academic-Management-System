import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function StudentTutor() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful academic tutor. Provide clear, educational explanations based on course materials.",
    },
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor. Select a course above and ask me any questions about the material. I'll help you understand the concepts and prepare for exams.",
    },
  ]);

  // Get enrolled courses
  const { data: enrolledCourses = [] } = trpc.student.getEnrolledCourses.useQuery();

  // Send message mutation
  const sendMessageMutation = trpc.student.sendAiMessage.useMutation({
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
        },
      ]);
    },
  });

  const handleSendMessage = (content: string) => {
    // Add user message to state
    setMessages((prev) => [...prev, { role: "user", content }]);

    // Send to AI tutor
    if (selectedCourse) {
      sendMessageMutation.mutate({
        courseOfferingId: parseInt(selectedCourse),
        message: content,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Tutor</h1>
        <p className="text-slate-600 mt-2">Get personalized help with your coursework</p>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Course</CardTitle>
          <CardDescription>Choose which course you need help with</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {enrolledCourses.map((enrollment) => (
                <SelectItem key={enrollment.id} value={enrollment.courseOfferingId.toString()}>
                  Course {enrollment.courseOfferingId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Chat Area */}
      {selectedCourse ? (
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
          placeholder="Ask your tutor a question..."
          height="600px"
          emptyStateMessage="Start asking questions about your course"
          suggestedPrompts={[
            "Explain the key concepts",
            "Help me with the assignment",
            "What will be on the exam?",
            "Can you clarify this topic?",
          ]}
        />
      ) : (
        <Card className="h-96 flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-slate-600">Select a course to start chatting with your AI tutor</p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Using Your AI Tutor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>• Ask specific questions about concepts you don't understand</p>
          <p>• Request explanations of difficult topics with examples</p>
          <p>• Ask for help understanding assignment requirements</p>
          <p>• Request practice problems and worked solutions</p>
          <p>• Use it to prepare for exams and quizzes</p>
        </CardContent>
      </Card>
    </div>
  );
}
