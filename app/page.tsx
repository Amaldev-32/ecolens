"use client";

import { signIn, useSession } from "next-auth/react";
import { Leaf, ArrowRight, Camera, Brain, Zap } from "lucide-react";
import AnalysisForm from "@/components/AnalysisForm";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center bg-white/60 backdrop-blur-xl p-12 rounded-3xl shadow-xl border border-white/40">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-emerald-600">
              <Leaf className="w-12 h-12" />
              <h1 className="text-4xl font-black tracking-tight">EcoLens</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                AI-Powered Waste Classification
              </h2>
              <p className="text-lg text-slate-600">
                Snap a photo. Get instant recycling guidance. Make a real impact on our planet with the power of Gemini AI.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-700 font-medium">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Camera className="w-5 h-5" />
                </div>
                Upload waste images
              </div>
              <div className="flex items-center gap-4 text-slate-700 font-medium">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Brain className="w-5 h-5" />
                </div>
                Detailed AI Analysis
              </div>
              <div className="flex items-center gap-4 text-slate-700 font-medium">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                Instant actionable steps
              </div>
            </div>

            <button
              onClick={() => signIn("google")}
              className="flex w-full sm:w-auto items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign in with Google
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:block">
            {/* Provide a visually appealing placeholder or generated illustration in real projects */}
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
              {/* Optional dynamic shapes or imagery can be added here */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Analysis</h1>
        <p className="text-slate-500">Upload images of waste to get detailed processing instructions.</p>
      </header>
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <AnalysisForm />
      </div>
    </div>
  );
}
