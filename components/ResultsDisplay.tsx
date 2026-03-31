"use client";

import { CheckCircle2, AlertCircle, Info, Recycle, Trash2, Leaf } from "lucide-react";

export type AnalysisResult = {
  items: string[];
  classification: "Compostable" | "Recyclable" | "Hazardous" | "Landfill";
  steps: string[];
  suggestion: string;
};

interface ResultsDisplayProps {
  result: AnalysisResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) return null;

  const getClassBadge = (cls: AnalysisResult["classification"]) => {
    switch (cls) {
      case "Compostable":
        return <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><Leaf className="w-5 h-5"/> Compostable</div>;
      case "Recyclable":
        return <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><Recycle className="w-5 h-5"/> Recyclable</div>;
      case "Hazardous":
        return <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Hazardous</div>;
      case "Landfill":
        return <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><Trash2 className="w-5 h-5"/> Landfill</div>;
      default:
        return <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><Info className="w-5 h-5"/> Unknown</div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Analysis Complete</h3>
          <p className="text-sm text-slate-500">Here's how to responsibly dispose of this item.</p>
        </div>
        {getClassBadge(result.classification)}
      </div>
      
      <div className="p-6 space-y-8">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
            Identified Items
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.items.map((item, idx) => (
              <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-sm font-medium border border-emerald-200">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
            Disposal Steps
          </h4>
          <ul className="space-y-3">
            {result.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-4 mt-6">
          <Info className="w-6 h-6 text-blue-500 shrink-0" />
          <div>
            <h5 className="font-semibold text-blue-900">Pro Tip</h5>
            <p className="text-sm text-blue-800 mt-1 leading-relaxed">{result.suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
