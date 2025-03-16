import { create } from "zustand";
import { z } from "zod";
import { questionsSchema } from "./schemas";

interface LearningContent {
  quiz: z.infer<typeof questionsSchema>;
  flashcards: Array<{ front: string; back: string }>;
  matching: Array<{ term: string; definition: string }>;
}

type ActiveSection = "upload" | "flashcards" | "matching" | "quiz";

interface LearningStore {
  content: LearningContent;
  activeSection: ActiveSection;
  setContent: (content: LearningContent) => void;
  setActiveSection: (section: ActiveSection) => void;
  clearContent: () => void;
}

const initialContent: LearningContent = {
  quiz: [],
  flashcards: [],
  matching: []
};

export const useLearningStore = create<LearningStore>()((set) => ({
  content: initialContent,
  activeSection: "upload",
  setContent: (content: LearningContent) => 
    set((state) => ({ 
      ...state,
      content: {
        quiz: content.quiz || [],
        flashcards: content.flashcards || [],
        matching: content.matching || []
      }
    })),
  setActiveSection: (section: ActiveSection) => 
    set((state) => ({ 
      ...state, 
      activeSection: section 
    })),
  clearContent: () => 
    set((state) => ({ 
      ...state,
      content: initialContent,
      activeSection: "upload"
    }))
}));
