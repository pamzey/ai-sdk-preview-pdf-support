"use client";

import { useState, useCallback } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, BookOpen, Puzzle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { useLearningStore } from "@/lib/store";
import Quiz from "@/components/quiz";
import Flashcards from "@/components/flashcards";
import Matching from "@/components/matching";

export default function LearningHub() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const content = useLearningStore((state) => state.content);
  const activeSection = useLearningStore((state) => state.activeSection);
  const setActiveSection = useLearningStore((state) => state.setActiveSection);
  const setContent = useLearningStore((state) => state.setContent);
  const clearContent = useLearningStore((state) => state.clearContent);

  const {
    submit,
    object: partialContent,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-learning-content",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate learning content. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      if (object) {
        try {
          const newContent = {
            quiz: object,
            flashcards: object.map(q => ({ 
              front: q.question,
              back: q.options[q.correctIndex] || ""
            })),
            matching: object.map(q => ({
              term: q.question,
              definition: q.options[q.correctIndex] || ""
            }))
          };
          
          // Generate a simple title from the file name
          if (files[0]) {
            const fileName = files[0].name.replace(/\.[^/.]+$/, ""); // Remove extension
            const words = fileName.split(/[^a-zA-Z0-9]+/);
            const title = words
              .filter(word => word.length > 0)
              .slice(0, 3)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ");
            setTitle(title || "Quiz");
          }

          setContent(newContent);
          setActiveSection("quiz");
        } catch (error) {
          toast.error("Failed to process the generated content. Please try again.");
          setFiles([]);
        }
      }
    },
  });

  const handleSubmitWithFiles = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.length) {
      toast.error("Please select a PDF file first.");
      return;
    }

    try {
      // Add loading state feedback
      const loadingToast = toast.loading("Processing your PDF file...");

      // Validate file size before encoding
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB.");
        toast.dismiss(loadingToast);
        return;
      }

      // Encode file with progress tracking
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const base64String = reader.result as string;
            // Validate the base64 string
            if (!base64String || !base64String.includes('base64,')) {
              throw new Error('Invalid file encoding');
            }
            resolve(base64String);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Submit with proper error handling
      await submit({ 
        files: [{
          name: file.name,
          type: file.type,
          data
        }]
      });

      toast.dismiss(loadingToast);
    } catch (error) {
      console.error('File processing error:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to process the file. Please try again."
      );
      setFiles([]);
    }
  }, [files, submit]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && isDragging) {
      toast.error("Safari does not support drag & drop. Please use the file picker.");
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
      return;
    }
    setFiles(validFiles);
  }, [isDragging]);

  const handleClearContent = useCallback(() => {
    setFiles([]);
    clearContent();
  }, [clearContent]);

  const progress = partialContent ? (partialContent.length / 4) * 100 : 0;

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center bg-gradient-to-b from-background to-muted/20 p-4"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-4xl border shadow-lg">
        <CardHeader className="text-center space-y-6">
          <motion.div 
            className="mx-auto flex items-center justify-center space-x-4 text-muted-foreground"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Puzzle className="h-8 w-8" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Interactive Learning Hub
            </CardTitle>
            <CardDescription className="text-lg">
              Transform any PDF into an interactive learning experience with AI-powered
              flashcards, matching games, and quizzes.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center space-x-2">
              <Button
                variant={activeSection === "upload" ? "default" : "outline"}
                onClick={() => setActiveSection("upload")}
              >
                Upload
              </Button>
              <Button
                variant={activeSection === "quiz" ? "default" : "outline"}
                onClick={() => setActiveSection("quiz")}
                disabled={content.quiz.length === 0}
              >
                Quiz
              </Button>
              <Button
                variant={activeSection === "flashcards" ? "default" : "outline"}
                onClick={() => setActiveSection("flashcards")}
                disabled={content.flashcards.length === 0}
              >
                Flashcards
              </Button>
              <Button
                variant={activeSection === "matching" ? "default" : "outline"}
                onClick={() => setActiveSection("matching")}
                disabled={content.matching.length === 0}
              >
                Matching
              </Button>
            </div>

            {activeSection === "upload" && (
              <form onSubmit={handleSubmitWithFiles} className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center space-y-4 transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                >
                  <div className="mx-auto w-fit rounded-full bg-primary/10 p-4">
                    <FileUp className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Upload your PDF</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload (max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Choose File
                  </Button>
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{files[0].name}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles([])}
                      >
                        Remove
                      </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Generate Learning Content
                        </>
                      )}
                    </Button>
                    {isLoading && <Progress value={progress} />}
                  </div>
                )}
              </form>
            )}

            {activeSection === "quiz" && (
              <div className="min-h-[400px]">
                {content.quiz.length > 0 ? (
                  <Quiz questions={content.quiz} title={title || "Quiz"} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Upload a PDF to generate quiz questions
                  </div>
                )}
              </div>
            )}

            {activeSection === "flashcards" && (
              <div className="min-h-[400px]">
                {content.flashcards.length > 0 ? (
                  <Flashcards cards={content.flashcards} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Upload a PDF to generate flashcards
                  </div>
                )}
              </div>
            )}

            {activeSection === "matching" && (
              <div className="min-h-[400px]">
                {content.matching.length > 0 ? (
                  <Matching pairs={content.matching} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Upload a PDF to generate matching pairs
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
