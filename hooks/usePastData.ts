"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/components/ResultsDisplay";

export type PastDataEntry = {
  id: string;
  timestamp: number;
  images: string[];
  context: string;
  result: AnalysisResult;
};

export function usePastData(userEmail?: string | null) {
  const [history, setHistory] = useState<PastDataEntry[]>([]);

  useEffect(() => {
    if (!userEmail) return;
    try {
      const storageKey = `ecolens_history_${userEmail}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, [userEmail]);

  const saveEntry = (entry: Omit<PastDataEntry, "id" | "timestamp">) => {
    if (!userEmail) return;
    
    const newEntry: PastDataEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const nextHistory = [newEntry, ...history];
    setHistory(nextHistory);
    
    try {
      const storageKey = `ecolens_history_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const clearHistory = () => {
    if (!userEmail) return;
    setHistory([]);
    try {
      localStorage.removeItem(`ecolens_history_${userEmail}`);
    } catch (e) {
      console.error("Failed to clear history from localStorage", e);
    }
  };

  return { history, saveEntry, clearHistory };
}
