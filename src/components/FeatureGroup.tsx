import { Feature, UserStory } from "@/types/prd";
import { StoryCard, StoryStatus, getStoryStatus } from "./StoryCard";

interface FeatureGroupProps {
  feature: Feature;
  status: StoryStatus;
}

/**
 * Groups stories from a feature for display within a Kanban column.
 * Shows feature name, progress bar, and filtered stories.
 */
export function FeatureGroup({ feature, status }: FeatureGroupProps) {
  const storiesForStatus = feature.userStories.filter(
    (story) => getStoryStatus(story) === status
  );

  if (storiesForStatus.length === 0) {
    return null;
  }

  const completedCount = feature.userStories.filter(
    (story) => story.passes
  ).length;
  const totalCount = feature.userStories.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {feature.name}
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {completedCount} of {totalCount}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300 dark:bg-green-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {storiesForStatus.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}

interface FeatureGroupListProps {
  features: Feature[];
  status: StoryStatus;
}

/**
 * Renders multiple FeatureGroups for a given status column.
 * Only shows features that have stories in the specified status.
 */
export function FeatureGroupList({ features, status }: FeatureGroupListProps) {
  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <FeatureGroup key={feature.id} feature={feature} status={status} />
      ))}
    </div>
  );
}
