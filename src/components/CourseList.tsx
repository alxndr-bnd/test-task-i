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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const t = themeTokens[theme];

  const visible = useMemo(() => {
    if (selectedCategory === "All") return courses;
    return courses.filter((course) => course.category === selectedCategory);
  }, [courses, selectedCategory]);

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
                background: t.card,
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
              background: index < 3 ? t.highlight : t.card,
            }}
          >
            <div style={{ fontWeight: 600, color: t.accent }}>
              #{index + 1} {course.title}
            </div>
            <div style={{ fontSize: "14px", color: t.muted }}>
              {course.category} • {course.level} • {course.language}
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
    </main>
  );
}
