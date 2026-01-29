# Course Ranking Algorithm (PoC)

## Purpose

This document explains how courses are ranked in the list: which factors contribute, how the score is computed, and how sorting works.

## Summary

Ranking is global (non-personalized). Each course receives a **FinalRankScore**, computed from four factors:

- **Q (QualityScore):** confidence-adjusted rating
- **P (PopularityScore):** normalized enrollments
- **F (FreshnessScore):** normalized recency of update
- **E (EditorialBoost):** boosts from Sponsored / Editor’s Choice

The list is sorted by **FinalRankScore** by default. Users can choose alternative sorts (price, freshness, etc.), which only change display order and do not change scores.

## Factors

### 1) QualityScore (Q)
- Based on average rating (1–5), normalized to 0–1.
- Adjusted by a **confidence factor** based on rating count.
- Confidence formula: `confidence = min(ratingCount / minRatingsForConfidence, 1.0)`.

### 2) PopularityScore (P)
- Enrollment count normalized across the dataset to 0–1.

### 3) FreshnessScore (F)
- Recency of `lastUpdatedAt`, normalized to 0–1 using a maximum age threshold.

### 4) EditorialBoost (E)
- Additive boost if a course is **Sponsored** and/or **Editor’s Choice**.
- Subject to:
  - **Quality floor**: rating must be >= quality floor to be eligible for promotion.
  - **Promotion cap**: only the top N eligible promoted courses get the boost.

## Scoring formula

### Base score
```
Base = (Q × wQ) + (P × wP) + (F × wF)
```

### Final score
```
FinalRankScore = Base + (E × wE)
```

Where the weights (`wQ`, `wP`, `wF`, `wE`) are global and configured in the admin panel.

## Promotion logic

A course can receive the editorial boost only if:

1) It is marked **Sponsored** or **Editor’s Choice**
2) Its ratingAvg >= quality floor
3) It is within the **promotion cap** (top N eligible promoted courses by Base score)

If any of the above are not met, **E is treated as 0** for that course.

## Sorting

### Default
- Sorted by **FinalRankScore** (descending)

### Alternative user sorts (display only)
- Price (low → high)
- Price (high → low)
- Freshness (recent updates)
- Newest (created date)
- Rating
- Popularity (enrollments)

These alternative sorts do **not** change FinalRankScore; they only change list order.

## Inputs and data

- Ratings are considered verified, post-completion (PoC assumption).
- Popularity uses enrollment count.
- Freshness uses `lastUpdatedAt`.
- Editorial flags are set by admins (Sponsored / Editor’s Choice).
- Quality floor and weights are admin-configured.

## Notes (PoC scope)

- No personalization
- No category-specific weights
- No ML models
- No revenue-optimized ranking
- No behavioral signals beyond enrollments
