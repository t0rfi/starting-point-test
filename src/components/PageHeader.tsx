"use client";

import { PRD } from "@/types/prd";
import { ViewToggle, ViewMode } from "./ViewToggle";
import { ThemeToggle } from "./ThemeToggle";

interface PageHeaderProps {
  prd: PRD;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

function getOverallProgress(prd: PRD): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const feature of prd.features) {
    for (const story of feature.userStories) {
      total++;
      if (story.passes) {
        completed++;
      }
    }
  }
  return { completed, total };
}

export function PageHeader({ prd, viewMode, onViewChange }: PageHeaderProps) {
  const progress = getOverallProgress(prd);
  const progressPercent = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Left side: Project info */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">
              {prd.project}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                {progress.completed}/{progress.total} done
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 sm:w-24">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Right side: Controls */}
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <ViewToggle currentView={viewMode} onViewChange={onViewChange} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
