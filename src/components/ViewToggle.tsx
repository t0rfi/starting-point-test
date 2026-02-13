"use client";

export type ViewMode = "board" | "list";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex touch-manipulation rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-800 sm:p-1">
      <button
        onClick={() => onViewChange("board")}
        className={`flex min-h-[36px] min-w-[36px] items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors active:scale-95 sm:min-h-0 sm:min-w-0 sm:px-3 sm:active:scale-100 ${
          currentView === "board"
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
        aria-pressed={currentView === "board"}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <span className="hidden sm:inline">Board</span>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex min-h-[36px] min-w-[36px] items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors active:scale-95 sm:min-h-0 sm:min-w-0 sm:px-3 sm:active:scale-100 ${
          currentView === "list"
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
        aria-pressed={currentView === "list"}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
}
