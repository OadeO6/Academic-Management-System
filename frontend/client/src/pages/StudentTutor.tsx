import { useState } from "react";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function StudentTutor() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your Academic AI Tutor. How can I help you with your studies today? I can explain complex concepts, help with assignments, or summarize your course materials." 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate AI thinking
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `I've received your question about "${content}". \n\nThis is a simulation of the AI Tutor response. In a production environment, this would be connected to an LLM backend (like OpenAI or Claude) through our tRPC API. \n\nHow else can I assist you?`
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Academic Tutor</h1>
        <p className="text-muted-foreground">
          Get instant help with your courses, assignments, and study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Intelligent Study Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Powered by Advanced Language Models</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              height="650px"
              placeholder="Ask me anything about your courses..."
              emptyStateMessage="Your personal AI tutor is ready to help"
              suggestedPrompts={[
                "Explain the latest lecture on Algorithms",
                "Help me structure my research paper",
                "Summarize the course materials for Database Systems",
                "Create a study plan for my upcoming exams"
              ]}
              className="border-none rounded-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
