/**
 * TypeScript types for PRD (Product Requirements Document) data structure.
 * These types match the schema used in prd.json.
 */

/**
 * Token usage statistics for a completed user story.
 */
export interface TokenUsage {
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
}

/**
 * Represents a single user story within a feature.
 */
export interface UserStory {
  /** Unique identifier for the story (e.g., "US-001") */
  id: string;
  /** Short title describing the story */
  title: string;
  /** Full description of the user story in user story format */
  description: string;
  /** List of criteria that must be met for the story to be complete */
  acceptanceCriteria: string[];
  /** Priority order within the feature (lower number = higher priority) */
  priority: number;
  /** Whether the story has been completed and passes all acceptance criteria */
  passes: boolean;
  /** ISO 8601 timestamp when work on the story started */
  startedAt?: string;
  /** ISO 8601 timestamp when the story was completed */
  completedAt?: string;
  /** Time spent on the story in seconds */
  durationSeconds?: number;
  /** Additional notes about the story */
  notes?: string;
  /** Token usage statistics (optional, tracked for completed stories) */
  tokenUsage?: TokenUsage;
}

/**
 * Represents a feature containing one or more user stories.
 */
export interface Feature {
  /** Unique identifier for the feature (e.g., "F-001") */
  id: string;
  /** Human-readable name of the feature */
  name: string;
  /** Git branch name for this feature */
  branchName: string;
  /** Feature ID that this feature depends on, or null if no dependency */
  dependsOn: string | null;
  /** Array of user stories that comprise this feature */
  userStories: UserStory[];
}

/**
 * Root structure of the PRD (Product Requirements Document).
 */
export interface PRD {
  /** Name of the project */
  project: string;
  /** Description of what the project does */
  description: string;
  /** Array of features that make up the project */
  features: Feature[];
}
