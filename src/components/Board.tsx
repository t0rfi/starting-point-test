"use client";

import { useCallback, useEffect, useState } from "react";
import { PRD } from "@/types/prd";
import { StoryStatus } from "./StoryCard";
import { FeatureGroupList } from "./FeatureGroup";
import { EmptyState } from "./EmptyState";
import { ListView } from "./ListView";
import { ViewMode } from "./ViewToggle";
import { PageHeader } from "./PageHeader";

/** Polling interval in milliseconds - can be adjusted as needed */
const POLL_INTERVAL_MS = 30000;

/** Local storage key for view preference */
const VIEW_PREFERENCE_KEY = "kanban-tracker-view";

const STATUSES: StoryStatus[] = ["backlog", "in-progress", "done"];

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

function getStoryCountByStatus(prd: PRD, status: StoryStatus): number {
  let count = 0;
  for (const feature of prd.features) {
    for (const story of feature.userStories) {
      const storyStatus = story.passes
        ? "done"
        : story.startedAt
          ? "in-progress"
          : "backlog";
      if (storyStatus === status) {
        count++;
      }
    }
  }
  return count;
}

function getStoredViewPreference(): ViewMode {
  if (typeof window === "undefined") return "board";
  const stored = localStorage.getItem(VIEW_PREFERENCE_KEY);
  if (stored === "board" || stored === "list") {
    return stored;
  }
  return "board";
}

export function Board() {
  const [prd, setPrd] = useState<PRD | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  // Load view preference from local storage on mount
  useEffect(() => {
    setViewMode(getStoredViewPreference());
  }, []);

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    localStorage.setItem(VIEW_PREFERENCE_KEY, view);
  };

  const fetchPrd = useCallback(async (isInitial: boolean = false) => {
    try {
      const response = await fetch("/api/prd");
      if (!response.ok) {
        if (response.status === 404) {
          setError("not-found");
        } else {
          setError("fetch-error");
        }
        return;
      }
      const data: PRD = await response.json();
      setPrd(data);
      // Clear any previous error on successful fetch
      setError(null);
    } catch {
      // Only set error on initial load; on subsequent polls, keep existing data
      if (isInitial) {
        setError("fetch-error");
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrd(true);
  }, [fetchPrd]);

  // Polling for updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPrd(false);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchPrd]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (error === "not-found" || !prd) {
    return <EmptyState />;
  }

  if (error === "fetch-error") {
    return (
      <EmptyState
        title="Error Loading PRD"
        message="There was a problem loading the prd.json file. Please check the console for details."
      />
    );
  }

  if (prd.features.length === 0) {
    return (
      <EmptyState
        title="No Features Found"
        message="The prd.json file exists but contains no features. Add some features to get started."
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <PageHeader
        prd={prd}
        viewMode={viewMode}
        onViewChange={handleViewChange}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div
          className={`transition-opacity duration-200 ${
            viewMode === "board" ? "opacity-100" : "opacity-0 absolute pointer-events-none"
          }`}
        >
          {viewMode === "board" && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-0 sm:snap-none sm:gap-6 sm:px-0">
              {STATUSES.map((status) => {
                const config = columnConfig[status];
                const storyCount = getStoryCountByStatus(prd, status);

                return (
                  <div
                    key={status}
                    className="flex w-[85vw] flex-shrink-0 snap-center flex-col sm:w-auto sm:min-w-[320px] sm:flex-1 sm:snap-align-none"
                  >
                    <div
                      className={`mb-3 rounded-lg px-3 py-2 ${config.headerBg}`}
                    >
                      <h2
                        className={`text-sm font-semibold ${config.headerText}`}
                      >
                        {config.title}{" "}
                        <span className="font-normal opacity-75">
                          ({storyCount})
                        </span>
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1">
                      <FeatureGroupList features={prd.features} status={status} />
                      {storyCount === 0 && (
                        <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                          No stories
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={`transition-opacity duration-200 ${
            viewMode === "list" ? "opacity-100" : "opacity-0 absolute pointer-events-none"
          }`}
        >
          {viewMode === "list" && <ListView features={prd.features} />}
        </div>
      </div>
    </div>
  );
}
