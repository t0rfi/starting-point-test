import { UserStory } from "@/types/prd";
import { StoryCard, StoryStatus } from "./StoryCard";

interface KanbanColumnProps {
  status: StoryStatus;
  stories: UserStory[];
}

const columnConfig: Record<
  StoryStatus,
  { title: string; headerBg: string; headerText: string }
> = {
  backlog: {
    title: "Backlog",
    headerBg: "bg-zinc-100 dark:bg-zinc-800",
    headerText: "text-zinc-700 dark:text-zinc-300",
  },
  "in-progress": {
    title: "In Progress",
    headerBg: "bg-blue-100 dark:bg-blue-900/30",
    headerText: "text-blue-700 dark:text-blue-300",
  },
  done: {
    title: "Done",
    headerBg: "bg-green-100 dark:bg-green-900/30",
    headerText: "text-green-700 dark:text-green-300",
  },
};

export function KanbanColumn({ status, stories }: KanbanColumnProps) {
  const config = columnConfig[status];

  return (
    <div className="flex min-w-[280px] flex-1 flex-col sm:min-w-[320px]">
      <div
        className={`mb-3 rounded-lg px-3 py-2 ${config.headerBg}`}
      >
        <h2 className={`text-sm font-semibold ${config.headerText}`}>
          {config.title}{" "}
          <span className="font-normal opacity-75">({stories.length})</span>
        </h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
        {stories.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
            No stories
          </div>
        )}
      </div>
    </div>
  );
}
