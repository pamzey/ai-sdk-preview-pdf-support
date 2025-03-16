"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useLearningStore } from "@/lib/store";
import Matching from "@/components/matching";

export default function MatchingPage() {
  const router = useRouter();
  const content = useLearningStore((state) => state.content);

  if (!content.matching.length) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No Content Available</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Please upload a PDF document first to generate matching content.
          </p>
          <Button onClick={() => router.push("/")}>
            Go to Upload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Matching pairs={content.matching} />
    </div>
  );
}
