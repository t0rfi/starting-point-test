"use client";

import { useState } from "react";
import { Feature, UserStory } from "@/types/prd";
import { StoryStatus, getStoryStatus } from "./StoryCard";
import { formatDuration } from "@/lib/formatDuration";

interface ListViewProps {
  features: Feature[];
}

const statusConfig: Record<
  StoryStatus,
  { indicator: string; label: string; textColor: string }
> = {
  backlog: {
    indicator: "bg-zinc-400 dark:bg-zinc-500",
    label: "Backlog",
    textColor: "text-zinc-600 dark:text-zinc-400",
  },
  "in-progress": {
    indicator: "bg-blue-500 dark:bg-blue-400",
    label: "In Progress",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  done: {
    indicator: "bg-green-500 dark:bg-green-400",
    label: "Done",
    textColor: "text-green-600 dark:text-green-400",
  },
};

interface StoryRowProps {
  story: UserStory;
}

function StoryRow({ story }: StoryRowProps) {
  const status = getStoryStatus(story);
  const config = statusConfig[status];

  return (
    <div className="flex min-h-[48px] touch-manipulation items-center gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0 active:bg-zinc-50 dark:border-zinc-800 dark:active:bg-zinc-700/50 sm:min-h-0 sm:gap-4 sm:px-6 sm:active:bg-transparent">
      <span
        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full sm:h-2 sm:w-2 ${config.indicator}`}
        title={config.label}
      />
      <span className="w-14 flex-shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:w-20 sm:text-sm">
        {story.id}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100">
        {story.title}
      </span>
      <span className={`hidden text-xs sm:inline ${config.textColor}`}>
        {config.label}
      </span>
      <span className="w-12 flex-shrink-0 text-right text-xs text-zinc-500 dark:text-zinc-400 sm:w-20">
        {status === "done" && story.durationSeconds !== undefined
          ? formatDuration(story.durationSeconds)
          : "-"}
      </span>
    </div>
  );
}

interface FeatureSectionProps {
  feature: Feature;
  isExpanded: boolean;
  onToggle: () => void;
}

function FeatureSection({ feature, isExpanded, onToggle }: FeatureSectionProps) {
  const completedCount = feature.userStories.filter(
    (story) => story.passes
  ).length;
  const totalCount = feature.userStories.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50">
      <button
        onClick={onToggle}
        className="flex min-h-[56px] w-full touch-manipulation items-center gap-3 px-4 py-3 text-left transition-colors active:bg-zinc-100 hover:bg-zinc-50 dark:active:bg-zinc-700 dark:hover:bg-zinc-700/50 sm:min-h-0 sm:px-6 sm:active:bg-zinc-50"
      >
        <svg
          className={`h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${
            isExpanded ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {feature.name}
          </span>
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {completedCount} of {totalCount}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300 dark:bg-green-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-700">
          {feature.userStories.map((story) => (
            <StoryRow key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ListView({ features }: ListViewProps) {
  // Initialize all sections as expanded by default
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(features.map((f) => f.id))
  );

  const toggleSection = (featureId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <FeatureSection
          key={feature.id}
          feature={feature}
          isExpanded={expandedSections.has(feature.id)}
          onToggle={() => toggleSection(feature.id)}
        />
      ))}
    </div>
  );
}
