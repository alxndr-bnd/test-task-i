"use client";

import { useMemo, useState } from "react";

type RankingBreakdownView = {
  qualityScore: number;
  popularityScore: number;
  freshnessScore: number;
  editorialBoost: number;
  baseScore: number;
  finalScore: number;
  formula: string;
};

type RankedCourseView = {
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
  lastUpdatedAt: string;
  isSponsored: boolean;
  isEditorsChoice: boolean;
  isAccredited: boolean;
  finalScore: number;
  reason: string;
  breakdown: RankingBreakdownView;
};

type Props = {
  courses: RankedCourseView[];
  categories: string[];
};

const themeTokens = {
  light: {
    bg: "#f7f4ef",
    card: "#ffffff",
    text: "#1f1a14",
    muted: "#5b524a",
    border: "#d8cfc3",
    accent: "#b56b2a",
    highlight: "#fff2d6",
  },
  dark: {
    bg: "#14110d",
    card: "#1e1812",
    text: "#f5efe7",
    muted: "#c8bfb4",
    border: "#3a2f25",
    accent: "#e1a66a",
    highlight: "#2b2016",
  },
} as const;

export default function CourseList({ courses, categories }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [practiceFilter, setPracticeFilter] = useState("All");
  const [sponsoredFilter, setSponsoredFilter] = useState("All");
  const [legendOpen, setLegendOpen] = useState(true);
  const t = themeTokens[theme];

  const visible = useMemo(() => {
    return courses.filter((course) => {
      if (selectedCategory !== "All" && course.category !== selectedCategory) {
        return false;
      }
      if (priceFilter === "Free" && course.priceCents !== 0) return false;
      if (priceFilter === "Paid" && course.priceCents === 0) return false;
      if (practiceFilter === "With" && !course.hasPractice) return false;
      if (practiceFilter === "Without" && course.hasPractice) return false;
      if (sponsoredFilter === "Sponsored" && !course.isSponsored) return false;
      if (sponsoredFilter === "Organic" && course.isSponsored) return false;
      return true;
    });
  }, [courses, selectedCategory, priceFilter, practiceFilter, sponsoredFilter]);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "10px" }}>Ranked Course List</h1>
          <p style={{ marginBottom: "20px", color: t.muted }}>
            Ordered by FinalRankScore. Showing top 20.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ fontSize: "14px", color: t.muted }}>
            Category
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${t.border}`,
        background: theme === "light" ? "#fff3e1" : "#2a1f16",
                color: t.text,
              }}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: "14px", color: t.muted }}>
            Price
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${t.border}`,
                background: t.card,
                color: t.text,
              }}
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </label>
          <label style={{ fontSize: "14px", color: t.muted }}>
            Practice
            <select
              value={practiceFilter}
              onChange={(event) => setPracticeFilter(event.target.value)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${t.border}`,
                background: t.card,
                color: t.text,
              }}
            >
              <option value="All">All</option>
              <option value="With">With practice</option>
              <option value="Without">Without practice</option>
            </select>
          </label>
          <label style={{ fontSize: "14px", color: t.muted }}>
            Sponsored
            <select
              value={sponsoredFilter}
              onChange={(event) => setSponsoredFilter(event.target.value)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${t.border}`,
                background: t.card,
                color: t.text,
              }}
            >
              <option value="All">All</option>
              <option value="Sponsored">Sponsored</option>
              <option value="Organic">Organic</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              height: "38px",
              padding: "0 16px",
              borderRadius: "999px",
              border: `1px solid ${t.border}`,
              background: t.card,
              color: t.text,
              cursor: "pointer",
            }}
          >
            Switch to {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {visible.map((course, index) => (
          <div
            key={course.id}
            style={{
              border: `1px solid ${t.border}`,
              borderRadius: "12px",
              padding: "12px 16px",
              background: t.card,
            }}
          >
            <div style={{ fontWeight: 600, color: t.accent }}>
              #{index + 1} {course.title}
            </div>
            <div style={{ fontSize: "14px", color: t.muted }}>
              {course.category} • {course.level} • {course.language} •{" "}
              {course.priceCents === 0 ? "Free" : "Paid"} •{" "}
              {course.hasPractice ? "With practice" : "No practice"}
            </div>
            <div style={{ fontSize: "13px", color: t.muted }}>
              Rating {course.ratingAvg.toFixed(1)} ({course.ratingCount}) •
              Enrollments {course.enrollments} • Updated{" "}
              {new Date(course.lastUpdatedAt).toDateString()}
            </div>
            <div style={{ marginTop: "6px", fontSize: "13px" }}>
              <strong>Why:</strong> {course.reason}
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "8px",
                border: `1px dashed ${t.border}`,
                fontSize: "12px",
                color: t.muted,
              }}
            >
              <div style={{ fontWeight: 600, color: t.text }}>
                Rank formula
              </div>
              <div>{course.breakdown.formula}</div>
              <div>
                Q={course.breakdown.qualityScore.toFixed(3)} · P=
                {course.breakdown.popularityScore.toFixed(3)} · F=
                {course.breakdown.freshnessScore.toFixed(3)} · E=
                {course.breakdown.editorialBoost.toFixed(3)}
              </div>
              <div>
                Base={course.breakdown.baseScore.toFixed(3)} → Final=
                {course.breakdown.finalScore.toFixed(3)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "210px",
          width: "340px",
          padding: "16px",
          borderRadius: "14px",
          border: `1px solid ${t.border}`,
          borderLeft: `6px solid ${t.accent}`,
          background: theme === "light" ? "#fff3e1" : "#2a1f16",
          fontSize: "14px",
          color: t.muted,
          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: legendOpen ? "10px" : 0,
          }}
        >
          <div style={{ fontWeight: 600, color: t.text }}>Ranking legend</div>
          <button
            type="button"
            onClick={() => setLegendOpen((prev) => !prev)}
            style={{
              border: `1px solid ${t.border}`,
              background: t.card,
              color: t.text,
              borderRadius: "8px",
              padding: "2px 8px",
              cursor: "pointer",
            }}
            aria-label={legendOpen ? "Collapse legend" : "Expand legend"}
          >
            {legendOpen ? "✕" : "▸"}
          </button>
        </div>
        {legendOpen ? (
          <>
            <div>
              Q = Quality score: rating normalized to 0–1 and scaled by rating
              confidence.
            </div>
            <div>
              P = Popularity score: enrollments normalized across the dataset.
            </div>
            <div>
              F = Freshness score: recency of last update normalized to 0–1.
            </div>
            <div>
              E = Editorial boost: extra weight for Sponsored or Editor’s Choice.
            </div>
            <div>
              Base = weighted sum of Q, P, F before editorial boost is applied.
            </div>
            <div>Final = Base + (E × editorial weight).</div>
          </>
        ) : (
          <div style={{ fontSize: "12px", color: t.muted }}>
            Legend collapsed — click to expand.
          </div>
        )}
      </div>
    </main>
  );
}
