"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, PlusCircle, History, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  const navItems = [
    { name: "New Analysis", href: "/", icon: PlusCircle },
    { name: "Past Data", href: "/past-data", icon: History },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-8 tracking-tight">
          <Leaf className="w-8 h-8" />
          <span>EcoLens</span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
                pathname === item.href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-emerald-500" : "text-slate-400 group-hover:text-slate-500")} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-4 py-3">
          {session?.user?.image ? (
            <img src={session.user.image} alt="User avatar" className="w-8 h-8 rounded-full border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {session?.user?.name?.[0] || "U"}
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-slate-700 truncate">{session?.user?.name}</span>
            <span className="text-xs text-slate-500 truncate">{session?.user?.email}</span>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 px-4 py-2 mt-2 text-sm font-medium text-slate-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
