# Course Ranking Principles — Prototype Specification (PoC)

## 1. Scope and assumptions (updated)

This document describes the ranking principles and system requirements for a course listing during the prototype (PoC) phase.

### Implemented in PoC

- Global (non-personalized) ranking
- Verified, post-completion ratings
- Enrollment-based popularity
- Explainable ranking
- Admin-controlled editorial and sponsored promotion
- Quality floor enforcement

### Explicitly not implemented in PoC (by design)

- Personalized ranking
- Category-specific ranking weights
- Machine-learning models
- Revenue-optimized ranking
- Behavioral signals beyond enrollments

These are documented as future-ready requirements to avoid redesign later, but excluded to keep PoC scope controlled.

## 2. Roles and permissions

### 2.1 User role

Capabilities:

- Browse courses by category
- Apply filters
- Select sorting options
- See ranking explanations (high-level, human-readable)
- See clear labels:
  - “Sponsored”
  - “Editor’s Choice”
  - “Accredited”

Restrictions:

- Cannot influence ranking logic
- Cannot see internal scores or thresholds

### 2.2 Administrator role

An admin panel is required to configure ranking-related parameters.

Admin capabilities:

- Configure global ranking weights:
  - Quality
  - Popularity
  - Freshness
  - Editorial boost
- Set and update:
  - Quality floor threshold
  - Promotion caps (e.g. max promoted courses per page)
- Assign editorial flags:
  - Editor’s Choice
  - Sponsored
- Define promotion window:
  - start date / end date
- Mark courses as Accredited
- View full ranking breakdown per course:
  - Raw values
  - Normalized scores
  - Applied boosts
  - FinalRankScore
- See admin-only warnings:
  - “Quality too low for promotion”

Admin restrictions:

- Cannot promote courses below the quality floor
- Cannot exceed configured promotion caps

## 3. Personalization (future requirement, not PoC)

Description

The system must support personalized ranking in the future, based on user attributes and behavior.

Potential signals (non-exhaustive):

- Preferred language
- Skill level (beginner/intermediate/advanced)
- Previously completed courses
- Interaction history (categories, topics)

PoC status

- ❌ Not implemented

Rationale:

Personalization significantly increases system complexity.

PoC goal is to validate ranking mechanics, not recommendation quality.

Design note:

Current ranking formula must be structured so that user-specific modifiers can be injected later without rewriting core logic.

## 4. Category-specific weights (future requirement, not PoC)

Description

Different course categories may require different ranking priorities.

Examples:

- Programming → quality & freshness weighted higher
- Soft skills → popularity weighted higher
- Compliance / certification → accreditation weighted higher

PoC status

- ❌ Not implemented

Rationale:

Adds configuration and tuning complexity.

Requires sufficient real data to calibrate properly.

Design note:

Weight configuration must be category-aware, even if PoC uses a single global weight set.

## 5. Ranking factors (unchanged, summarized)

- QualityScore — confidence-adjusted rating (primary)
- PopularityScore — enrollment count
- FreshnessScore — recency of update
- EditorialBoost — admin-controlled, capped

Quality floor applies before editorial promotion.

## 6. Explainability requirements (PoC)

User-facing

Short, plain-language explanation:

- “Highly rated and popular”
- “Recently updated”
- “Sponsored course”

PoC transparency additions (implemented):

- Show calculated values Q / P / F / E with inline hover tooltips
- Show Base and Final calculations step-by-step
- Show formula line (PoC-only transparency) with link to admin weights

Admin-facing

Full transparency:

- All raw inputs
- Score normalization
- Boost application
- FinalRankScore

Visual indicators for:

- Promotion eligibility
- Quality floor violations

Explainability is mandatory in PoC to validate trust and debuggability.

## 7. PoC data requirements (demo readiness)

### 7.1 Fake course dataset

For PoC, the system must include ~50 synthetic courses to demonstrate ranking behavior.

The dataset must intentionally vary across:

Core attributes

- Duration (short / medium / long)
- Price (free / paid)
- Enrollment count (low → high)
- Rating average (low → high)
- Rating volume (few → many)
- Update date (recent → outdated)

Flags

- With / without practice
- With / without certificate
- Accredited / non-accredited
- Editor’s Choice
- Sponsored

Edge cases

- High rating, low enrollments
- High enrollments, average rating
- Recently updated but low popularity
- Popular but outdated
- Promoted but barely above quality floor

### 7.2 Purpose of synthetic data

The fake dataset must allow reviewers to:

- Visually verify ranking logic
- Observe trade-offs between factors
- Validate quality floor behavior
- See promotion constraints in action
- Confirm explainability messages match ranking outcomes

This is not test data, but demonstration data.

## 8. PoC UI extras (implemented)

- User/admin switcher link at the top of both pages
- Theme toggle on user page (default light)
- Filters: Category, Price (Free/Paid), Practice (With/Without), Sponsored (Sponsored/Organic)
- Sorting: FinalRankScore (default), Price (asc/desc), Freshness, Newest (created), Rating, Popularity
- Floating legend on the right explaining Q/P/F/E, Base, Final

## 9. PoC admin (current state)

- Read-only admin page at `/admin`
- Shows all ranking settings
- Shows full per-course breakdown + warnings for quality floor violations

## 10. PoC data determinism

- Seeded data is deterministic across environments (fixed seed + fixed base date)
- Seed runs on app start in production to ensure consistent demo data
