import { UserStory } from "@/types/prd";
import { formatDuration } from "@/lib/formatDuration";

export type StoryStatus = "backlog" | "in-progress" | "done";

/**
 * Determines the status of a story based on its passes and startedAt fields.
 */
export function getStoryStatus(story: UserStory): StoryStatus {
  if (story.passes) {
    return "done";
  }
  if (story.startedAt) {
    return "in-progress";
  }
  return "backlog";
}

interface StoryCardProps {
  story: UserStory;
}

const statusConfig: Record<
  StoryStatus,
  { bg: string; border: string; indicator: string; label: string }
> = {
  backlog: {
    bg: "bg-zinc-50 dark:bg-zinc-800/50",
    border: "border-zinc-200 dark:border-zinc-700",
    indicator: "bg-zinc-400 dark:bg-zinc-500",
    label: "Backlog",
  },
  "in-progress": {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    indicator: "bg-blue-500 dark:bg-blue-400",
    label: "In Progress",
  },
  done: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    indicator: "bg-green-500 dark:bg-green-400",
    label: "Done",
  },
};

export function StoryCard({ story }: StoryCardProps) {
  const status = getStoryStatus(story);
  const config = statusConfig[status];

  return (
    <div
      className={`min-h-[88px] touch-manipulation rounded-lg border p-3 active:scale-[0.98] sm:min-h-0 sm:p-4 sm:active:scale-100 ${config.bg} ${config.border} transition-all`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 flex-shrink-0 rounded-full sm:h-2 sm:w-2 ${config.indicator}`}
            title={config.label}
          />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {story.id}
          </span>
        </div>
        {status === "done" && story.durationSeconds !== undefined && (
          <span className="flex-shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
            {formatDuration(story.durationSeconds)}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100 sm:text-base sm:leading-tight">
        {story.title}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-sm sm:leading-normal">
        {story.description}
      </p>
    </div>
  );
}
