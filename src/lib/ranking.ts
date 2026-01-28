type ScoreInputs = {
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  lastUpdatedAt: Date;
  isSponsored: boolean;
  isEditorsChoice: boolean;
};

type Settings = {
  qualityWeight: number;
  popularityWeight: number;
  freshnessWeight: number;
  editorialWeight: number;
  qualityFloor: number;
  promotionCap: number;
  sponsoredBoost: number;
  editorsChoiceBoost: number;
  minRatingsForConfidence: number;
  freshnessMaxAgeDays: number;
};

export type RankingBreakdown = {
  qualityScore: number;
  popularityScore: number;
  freshnessScore: number;
  editorialBoost: number;
  baseScore: number;
  finalScore: number;
  formula: string;
  qualityWeight: number;
  popularityWeight: number;
  freshnessWeight: number;
  editorialWeight: number;
};

export type RankedCourse = {
  id: string;
  title: string;
  category: string;
  level: string;
  language: string;
  priceCents: number;
  hasPractice: boolean;
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  lastUpdatedAt: Date;
  createdAt: Date;
  isSponsored: boolean;
  isEditorsChoice: boolean;
  isAccredited: boolean;
  finalScore: number;
  reason: string;
  breakdown: RankingBreakdown;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalize = (value: number, min: number, max: number) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

const computeQualityScore = (
  ratingAvg: number,
  ratingCount: number,
  minRatingsForConfidence: number
) => {
  const confidence = clamp(ratingCount / minRatingsForConfidence, 0, 1);
  const base = normalize(ratingAvg, 1, 5);
  return base * confidence + base * 0.2 * (1 - confidence);
};

const computeFreshnessScore = (lastUpdatedAt: Date, maxAgeDays: number) => {
  const ageMs = Date.now() - lastUpdatedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const normalized = 1 - clamp(ageDays / maxAgeDays, 0, 1);
  return normalized;
};

export const rankCourses = (
  courses: RankedCourse[],
  settings: Settings
): RankedCourse[] => {
  const enrollments = courses.map((course) => course.enrollments);
  const minEnrollments = Math.min(...enrollments);
  const maxEnrollments = Math.max(...enrollments);

  return courses
    .map((course) => {
      const qualityScore = computeQualityScore(
        course.ratingAvg,
        course.ratingCount,
        settings.minRatingsForConfidence
      );
      const popularityScore = normalize(
        course.enrollments,
        minEnrollments,
        maxEnrollments
      );
      const freshnessScore = computeFreshnessScore(
        course.lastUpdatedAt,
        settings.freshnessMaxAgeDays
      );

      const baseScore =
        qualityScore * settings.qualityWeight +
        popularityScore * settings.popularityWeight +
        freshnessScore * settings.freshnessWeight;

      const belowQualityFloor = course.ratingAvg < settings.qualityFloor;

      const editorialBoost = !belowQualityFloor
        ? (course.isSponsored ? settings.sponsoredBoost : 0) +
          (course.isEditorsChoice ? settings.editorsChoiceBoost : 0)
        : 0;

      const finalScore = baseScore + editorialBoost * settings.editorialWeight;

      const reasonParts = [] as string[];
      if (course.isSponsored) reasonParts.push("Sponsored course");
      if (course.isEditorsChoice) reasonParts.push("Editor’s Choice");
      if (qualityScore > 0.7 && popularityScore > 0.5) {
        reasonParts.push("Highly rated and popular");
      } else if (freshnessScore > 0.7) {
        reasonParts.push("Recently updated");
      } else if (qualityScore > 0.6) {
        reasonParts.push("Strong rating");
      }

      const formula = `Final = (Q*${settings.qualityWeight.toFixed(
        2
      )}) + (P*${settings.popularityWeight.toFixed(
        2
      )}) + (F*${settings.freshnessWeight.toFixed(
        2
      )}) + (E*${settings.editorialWeight.toFixed(2)})`;

      return {
        ...course,
        finalScore,
        reason: reasonParts[0] ?? "Balanced ranking",
        breakdown: {
          qualityScore,
          popularityScore,
          freshnessScore,
          editorialBoost,
          baseScore,
          finalScore,
          formula,
          qualityWeight: settings.qualityWeight,
          popularityWeight: settings.popularityWeight,
          freshnessWeight: settings.freshnessWeight,
          editorialWeight: settings.editorialWeight,
        },
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
};
