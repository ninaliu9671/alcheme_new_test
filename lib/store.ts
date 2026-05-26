"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Card } from "./types";

type State = {
  entries: Card[];
  currentDraft: string;
  currentExtract: string[];
  addEntry: (card: Card) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, patch: Partial<Pick<Card, "sentences" | "rawText">>) => void;
  setDraft: (text: string) => void;
  setExtract: (sentences: string[]) => void;
  reset: () => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      entries: [],
      currentDraft: "",
      currentExtract: [],
      addEntry: (card) =>
        set((s) => ({ entries: [card, ...s.entries] })),
      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((c) => c.id !== id) })),
      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      setDraft: (text) => set({ currentDraft: text }),
      setExtract: (sentences) => set({ currentExtract: sentences }),
      reset: () => set({ currentDraft: "", currentExtract: [] }),
    }),
    {
      name: "alcheme-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any)
      ),
      partialize: (s) => ({ entries: s.entries }),
    }
  )
);
