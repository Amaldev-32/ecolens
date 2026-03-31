"use client";

import { useSession } from "next-auth/react";
import { usePastData } from "@/hooks/usePastData";
import { Clock, Loader2, Trash2 } from "lucide-react";
import ResultsDisplay from "@/components/ResultsDisplay";

export default function PastDataPage() {
  const { data: session, status } = useSession();
  const { history, clearHistory } = usePastData(session?.user?.email);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 space-y-4">
        <p>Please sign in to view your past analysis data.</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Past Analysis</h1>
          <p className="text-slate-500">Your historical waste classification data.</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your local history?")) {
                clearHistory();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">No past data</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Your recent waste analyses will appear here. Try uploading an image on the dashboard!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 pb-12">
            {history.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
                
                {/* Images Thumbnail Viewer */}
                <div className="w-full lg:w-48 bg-slate-100 flex p-4 shrink-0 overflow-x-auto gap-3 items-start border-b lg:border-b-0 lg:border-r border-slate-200">
                  {entry.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Past analysis" className="w-24 h-24 lg:w-full lg:h-32 object-cover rounded-xl shadow-sm border border-black/5 shrink-0" />
                  ))}
                </div>

                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <Clock className="w-4 h-4" />
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  
                  {entry.context && (
                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 italic border border-slate-100">
                      "{entry.context}"
                    </div>
                  )}

                  <ResultsDisplay result={entry.result} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
