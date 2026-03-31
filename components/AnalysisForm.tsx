"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, RefreshCw } from "lucide-react";
import ImageUploader from "./ImageUploader";
import ResultsDisplay, { AnalysisResult } from "./ResultsDisplay";
import { usePastData } from "@/hooks/usePastData";

export default function AnalysisForm() {
  const { data: session } = useSession();
  const { saveEntry } = usePastData(session?.user?.email);
  
  const [images, setImages] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze images. Please try again.");
      }

      setResult(data.result);
      saveEntry({ images, context, result: data.result });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setContext("");
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ResultsDisplay result={result} />
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
            Analyze Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-3xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">1. Upload Image(s)</h2>
          <ImageUploader onImagesChange={setImages} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">2. Additional Context <span className="text-slate-400 font-normal text-sm ml-2">(Optional)</span></h2>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., 'Is this considered mixed paper?' or 'The lid is made of plastic...'"
            className="w-full min-h-[120px] p-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="font-semibold block">{error}</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/80 mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || images.length === 0}
          className="flex items-center justify-center gap-3 w-full max-w-3xl mx-auto py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md group disabled:opacity-50 disabled:cursor-not-allowed
          bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing with AI...
            </>
          ) : (
            <>
              <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Analyze Impact
            </>
          )}
        </button>
      </div>
    </div>
  );
}
