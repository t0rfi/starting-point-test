interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No PRD Found",
  message = "The prd.json file is missing or could not be loaded.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
        <svg
          className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="mb-6 max-w-md text-zinc-600 dark:text-zinc-400">{message}</p>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Expected file location:
        </p>
        <code className="rounded bg-zinc-200 px-2 py-1 font-mono text-sm text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
          ./prd.json
        </code>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Create a prd.json file in your project root to get started.
        </p>
      </div>
    </div>
  );
}
