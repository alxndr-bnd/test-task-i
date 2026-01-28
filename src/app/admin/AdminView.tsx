"use client";

type RankedCourseView = {
  id: string;
  title: string;
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  lastUpdatedAt: string;
  breakdown: {
    qualityScore: number;
    popularityScore: number;
    freshnessScore: number;
    editorialBoost: number;
    baseScore: number;
    finalScore: number;
    formula: string;
  };
};

type SettingsView = {
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

type Props = {
  settings: SettingsView;
  ranked: RankedCourseView[];
  qualityFloor: number;
};

const themeTokens = {
  light: {
    bg: "#f7f4ef",
    card: "#ffffff",
    text: "#1f1a14",
    muted: "#5b524a",
    border: "#d8cfc3",
    accent: "#b56b2a",
  },
  dark: {
    bg: "#14110d",
    card: "#1e1812",
    text: "#f5efe7",
    muted: "#c8bfb4",
    border: "#3a2f25",
    accent: "#e1a66a",
  },
} as const;

export default function AdminView({ settings, ranked, qualityFloor }: Props) {
  const t = themeTokens.light;

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "Georgia, serif",
        background: t.bg,
        minHeight: "100vh",
        color: t.text,
      }}
    >
      <h1 style={{ marginBottom: "12px" }}>Admin Panel (Read-only)</h1>
      <section
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
          background: t.card,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Ranking Settings</h2>
        <div>Quality weight: {settings.qualityWeight}</div>
        <div>Popularity weight: {settings.popularityWeight}</div>
        <div>Freshness weight: {settings.freshnessWeight}</div>
        <div>Editorial weight: {settings.editorialWeight}</div>
        <div>Quality floor: {settings.qualityFloor}</div>
        <div>Promotion cap: {settings.promotionCap}</div>
        <div>Sponsored boost: {settings.sponsoredBoost}</div>
        <div>Editor’s Choice boost: {settings.editorsChoiceBoost}</div>
        <div>Min ratings for confidence: {settings.minRatingsForConfidence}</div>
        <div>Freshness max age (days): {settings.freshnessMaxAgeDays}</div>
      </section>

      <section>
        <h2>Ranking Breakdown</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {ranked.map((course, index) => (
            <div
              key={course.id}
              style={{
                border: `1px solid ${t.border}`,
                borderRadius: "10px",
                padding: "12px 16px",
                background: t.card,
              }}
            >
              <div style={{ fontWeight: 600, color: t.accent }}>
                #{index + 1} {course.title}
              </div>
              <div style={{ fontSize: "13px", color: t.muted }}>
                Rating {course.ratingAvg.toFixed(1)} ({course.ratingCount}) •
                Enrollments {course.enrollments} • Updated{" "}
                {new Date(course.lastUpdatedAt).toDateString()}
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                Q={course.breakdown.qualityScore.toFixed(3)} · P=
                {course.breakdown.popularityScore.toFixed(3)} · F=
                {course.breakdown.freshnessScore.toFixed(3)} · E=
                {course.breakdown.editorialBoost.toFixed(3)}
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                Base={course.breakdown.baseScore.toFixed(3)} → Final=
                {course.breakdown.finalScore.toFixed(3)}
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                {course.breakdown.formula}
              </div>
              {course.ratingAvg < qualityFloor && (
                <div style={{ color: "#b00020", fontSize: "12px" }}>
                  Warning: Quality too low for promotion
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
