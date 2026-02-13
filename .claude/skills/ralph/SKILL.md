---
name: ralph
description: "Convert PRDs to prd.json format for the Ralph autonomous agent system. Use when you have an existing PRD and need to convert it to Ralph's JSON format. Triggers on: convert this prd, turn this into ralph format, create prd.json from this, ralph json."
user-invocable: true
---

# Ralph PRD Converter

Converts existing PRDs to the prd.json format that Ralph uses for autonomous execution.

---

## The Job

Take a PRD (markdown file or text) and convert it to `prd.json` in your ralph directory.

---

## Output Format

```json
{
  "project": "[Project Name]",
  "description": "[Overall description]",
  "features": [
    {
      "id": "F-001",
      "name": "[Feature name]",
      "branchName": "ralph/[project-kebab]/[feature-kebab]",
      "dependsOn": null,
      "userStories": [
        {
          "id": "US-001",
          "title": "[Story title]",
          "description": "As a [user], I want [feature] so that [benefit]",
          "acceptanceCriteria": [
            "Criterion 1",
            "Criterion 2",
            "Typecheck passes"
          ],
          "priority": 1,
          "passes": false,
          "notes": ""
        }
      ]
    },
    {
      "id": "F-002",
      "name": "[Another feature name]",
      "branchName": "ralph/[project-kebab]/[another-feature-kebab]",
      "dependsOn": "F-001",
      "userStories": [
        {
          "id": "US-003",
          "title": "[Story title]",
          "description": "As a [user], I want [feature] so that [benefit]",
          "acceptanceCriteria": [
            "Criterion 1",
            "Typecheck passes"
          ],
          "priority": 1,
          "passes": false,
          "notes": ""
        }
      ]
    }
  ]
}
```

### Schema Notes

- **`features`**: Array of feature groups, each with its own branch and optional dependency.
- **`dependsOn`**: Either `null` (branches from main) or a feature ID string (branches from that feature's branch).
- **Story IDs are globally unique** across all features (US-001, US-002, ... sequential across the entire PRD).
- **Legacy format**: If a prd.json has no `features` key (flat `userStories` at root), it is the deprecated legacy format. The new format should always be used for new PRDs.

---

## Story Size: The Number One Rule

**Each story must be completable in ONE Ralph iteration (one context window).**

Ralph spawns a fresh Amp instance per iteration with no memory of previous work. If a story is too big, the LLM runs out of context before finishing and produces broken code.

### Right-sized stories:
- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

### Too big (split these):
- "Build the entire dashboard" - Split into: schema, queries, UI components, filters
- "Add authentication" - Split into: schema, middleware, login UI, session handling
- "Refactor the API" - Split into one story per endpoint or pattern

**Rule of thumb:** If you cannot describe the change in 2-3 sentences, it is too big.

---

## Story Ordering: Dependencies First

Stories execute in priority order. Earlier stories must not depend on later ones.

**Correct order:**
1. Schema/database changes (migrations)
2. Server actions / backend logic
3. UI components that use the backend
4. Dashboard/summary views that aggregate data

**Wrong order:**
1. UI component (depends on schema that does not exist yet)
2. Schema change

---

## Acceptance Criteria: Must Be Verifiable

Each criterion must be something Ralph can CHECK, not something vague.

### Good criteria (verifiable):
- "Add `status` column to tasks table with default 'pending'"
- "Filter dropdown has options: All, Active, Completed"
- "Clicking delete shows confirmation dialog"
- "Typecheck passes"
- "Tests pass"

### Bad criteria (vague):
- "Works correctly"
- "User can do X easily"
- "Good UX"
- "Handles edge cases"

### Always include as final criterion:
```
"Typecheck passes"
```

For stories with testable logic, also include:
```
"Tests pass"
```

### For stories that change UI, also include:
```
"Verify in browser using dev-browser skill"
```

Frontend stories are NOT complete until visually verified. Ralph will use the dev-browser skill to navigate to the page, interact with the UI, and confirm changes work.

---

## Conversion Rules

1. **Each user story becomes one JSON entry**
2. **IDs**: Story IDs are globally unique and sequential across all features (US-001, US-002, etc.)
3. **Feature IDs**: Sequential (F-001, F-002, etc.)
4. **Priority**: Based on dependency order within each feature, then document order
5. **All stories**: `passes: false` and empty `notes`
6. **branchName**: Each feature gets `ralph/[project-kebab]/[feature-kebab]`
7. **Always add**: "Typecheck passes" to every story's acceptance criteria

---

## Splitting Large PRDs

If a PRD has big features, split them:

**Original:**
> "Add user notification system"

**Split into:**
1. US-001: Add notifications table to database
2. US-002: Create notification service for sending notifications
3. US-003: Add notification bell icon to header
4. US-004: Create notification dropdown panel
5. US-005: Add mark-as-read functionality
6. US-006: Add notification preferences page

Each is one focused change that can be completed and verified independently.

---

## Feature Grouping

After splitting stories to the right size, cluster them into **features** of 2-5 stories.

### Grouping rules:
- **Group by domain cohesion**: Stories touching the same tables, components, or endpoints go together.
- **Order features by dependency**: Schema/foundation features first, then features that build on them.
- **Set `dependsOn` only when a feature truly requires another feature's code to exist.** If two features touch unrelated areas, they should both have `dependsOn: null`.
- **Keep dependency chains linear and shallow**: Ideally max 3 deep. Avoid fan-out or diamond dependencies.
- **Branch naming**: Each feature gets `ralph/[project-kebab]/[feature-kebab]`.

### Feature sizing:

- **Right-sized feature:** 2-5 stories, one domain concern (e.g., "Board CRUD", "Card Management", "User Auth")
- **Too big:** 6+ stories or spanning multiple unrelated domain areas -- split further into separate features
- **Too small:** 1 story -- merge into an adjacent feature unless it's truly independent

---

## Example

**Input PRD:**
```markdown
# Kanban Board Feature

Build a kanban board with boards, columns, and cards.

## Requirements
- Create and manage boards
- Add columns to boards with ordering
- Add cards to columns with drag-and-drop
- Persist everything in database
```

**Output prd.json:**
```json
{
  "project": "KanbanApp",
  "description": "Kanban Board Feature - Boards, columns, and cards with drag-and-drop",
  "features": [
    {
      "id": "F-001",
      "name": "Board CRUD",
      "branchName": "ralph/kanban-app/board-crud",
      "dependsOn": null,
      "userStories": [
        {
          "id": "US-001",
          "title": "Add boards table and entity",
          "description": "As a developer, I need to store boards in the database.",
          "acceptanceCriteria": [
            "Add boards table with id, name, created_at columns",
            "Generate and run migration successfully",
            "Typecheck passes"
          ],
          "priority": 1,
          "passes": false,
          "notes": ""
        },
        {
          "id": "US-002",
          "title": "Add board CRUD API endpoints",
          "description": "As a user, I want to create, read, update, and delete boards.",
          "acceptanceCriteria": [
            "POST /api/boards creates a board",
            "GET /api/boards returns all boards",
            "PUT /api/boards/{id} updates a board",
            "DELETE /api/boards/{id} deletes a board",
            "Tests pass",
            "Typecheck passes"
          ],
          "priority": 2,
          "passes": false,
          "notes": ""
        },
        {
          "id": "US-003",
          "title": "Add board list and create UI",
          "description": "As a user, I want to see my boards and create new ones.",
          "acceptanceCriteria": [
            "Board list page shows all boards",
            "Create board button opens form",
            "New board appears in list after creation",
            "Typecheck passes",
            "Verify in browser using dev-browser skill"
          ],
          "priority": 3,
          "passes": false,
          "notes": ""
        }
      ]
    },
    {
      "id": "F-002",
      "name": "Column Management",
      "branchName": "ralph/kanban-app/column-management",
      "dependsOn": "F-001",
      "userStories": [
        {
          "id": "US-004",
          "title": "Add columns table and entity",
          "description": "As a developer, I need to store columns linked to boards.",
          "acceptanceCriteria": [
            "Add columns table with id, board_id, name, position columns",
            "Foreign key to boards table",
            "Generate and run migration successfully",
            "Typecheck passes"
          ],
          "priority": 1,
          "passes": false,
          "notes": ""
        },
        {
          "id": "US-005",
          "title": "Add column CRUD endpoints and board detail UI",
          "description": "As a user, I want to add and reorder columns on a board.",
          "acceptanceCriteria": [
            "POST /api/boards/{id}/columns creates a column",
            "Board detail page shows columns in order",
            "Columns can be reordered",
            "Tests pass",
            "Typecheck passes",
            "Verify in browser using dev-browser skill"
          ],
          "priority": 2,
          "passes": false,
          "notes": ""
        }
      ]
    },
    {
      "id": "F-003",
      "name": "Card Management",
      "branchName": "ralph/kanban-app/card-management",
      "dependsOn": "F-002",
      "userStories": [
        {
          "id": "US-006",
          "title": "Add cards table and CRUD endpoints",
          "description": "As a developer, I need to store cards linked to columns.",
          "acceptanceCriteria": [
            "Add cards table with id, column_id, title, description, position columns",
            "Foreign key to columns table",
            "CRUD endpoints for cards under columns",
            "Tests pass",
            "Typecheck passes"
          ],
          "priority": 1,
          "passes": false,
          "notes": ""
        },
        {
          "id": "US-007",
          "title": "Display cards in columns",
          "description": "As a user, I want to see cards within each column.",
          "acceptanceCriteria": [
            "Cards display within their column",
            "Add card button in each column",
            "Card shows title and truncated description",
            "Typecheck passes",
            "Verify in browser using dev-browser skill"
          ],
          "priority": 2,
          "passes": false,
          "notes": ""
        },
        {
          "id": "US-008",
          "title": "Add drag-and-drop for cards between columns",
          "description": "As a user, I want to move cards between columns by dragging.",
          "acceptanceCriteria": [
            "Cards can be dragged between columns",
            "Card position updates in database on drop",
            "Visual feedback during drag",
            "Typecheck passes",
            "Verify in browser using dev-browser skill"
          ],
          "priority": 3,
          "passes": false,
          "notes": ""
        }
      ]
    }
  ]
}
```

Note the dependency chain: F-001 (Board CRUD) -> F-002 (Column Management) -> F-003 (Card Management). Each feature builds on the previous one. Story IDs are globally unique and sequential across all features.

---

## Archiving Previous Runs

**Before writing a new prd.json, check if there is an existing one from a different project:**

1. Read the current `prd.json` if it exists
2. Check if the `project` name differs from the new project (or if `features[0].branchName` namespace differs)
3. If different AND `progress.txt` has content beyond the header:
   - Create archive folder: `archive/YYYY-MM-DD-feature-name/`
   - Copy current `prd.json` and `progress.txt` to archive
   - Reset `progress.txt` with fresh header

**The ralph.sh script handles this automatically** when you run it, but if you are manually updating prd.json between runs, archive first.

---

## Checklist Before Saving

Before writing prd.json, verify:

- [ ] **Previous run archived** (if prd.json exists with different project/namespace, archive it first)
- [ ] Each story is completable in one iteration (small enough)
- [ ] Stories are ordered by dependency (schema to backend to UI) within each feature
- [ ] Every story has "Typecheck passes" as criterion
- [ ] UI stories have "Verify in browser using dev-browser skill" as criterion
- [ ] Acceptance criteria are verifiable (not vague)
- [ ] No story depends on a later story within its feature
- [ ] Features contain 2-5 stories each
- [ ] `dependsOn` chains are linear and shallow (max 3-4 deep)
- [ ] Independent features have `dependsOn: null`
- [ ] Each feature has a unique `branchName` under a shared `ralph/[project-kebab]/` namespace
- [ ] Story IDs are globally unique and sequential across all features
