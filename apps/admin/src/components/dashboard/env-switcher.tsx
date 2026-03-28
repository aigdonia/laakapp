"use client";

import { useTransition } from "react";
import { switchApiEnv } from "@/app/actions/switch-env";
import type { ApiEnv } from "@/lib/api";

export function EnvSwitcher({ currentEnv }: { currentEnv: ApiEnv }) {
  const [isPending, startTransition] = useTransition();
  const isProduction = currentEnv === "production";

  function toggle() {
    startTransition(() => {
      switchApiEnv(isProduction ? "local" : "production");
    });
  }

  return (
    <>
      {isProduction && (
        <div className="fixed top-0 right-0 z-50 overflow-hidden pointer-events-none">
          <div className="bg-red-600 text-white text-xs font-bold px-10 py-1 rotate-45 translate-x-8 translate-y-3 shadow-lg">
            PRODUCTION
          </div>
        </div>
      )}
      <button
        onClick={toggle}
        disabled={isPending}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-colors ${
          isProduction
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
        } ${isPending ? "opacity-50" : ""}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isProduction ? "bg-red-300 animate-pulse" : "bg-green-400"
          }`}
        />
        {isPending ? "Switching..." : isProduction ? "Production" : "Local"}
      </button>
    </>
  );
}
