"use client";

import { useMemo, useState } from "react";

type HoverLabelProps = {
  label: string;
  description: string;
  textColor: string;
  borderColor: string;
  bg: string;
  href?: string;
};

function HoverLabel({
  label,
  description,
  textColor,
  borderColor,
  bg,
  href,
}: HoverLabelProps) {
  const [open, setOpen] = useState(false);

  const Tag = href ? "a" : "span";

  return (
    <span
      style={{ position: "relative", fontWeight: 600, color: textColor }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Tag
        href={href}
        style={{ color: textColor, textDecoration: href ? "underline" : "none" }}
      >
        {label}
      </Tag>
      {open && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            left: "12px",
            transform: "translateY(-100%)",
            background: bg,
            color: textColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: "6px 8px",
            fontSize: "11px",
            whiteSpace: "nowrap",
            zIndex: 20,
            boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          }}
        >
          {description}
        </span>
      )}
    </span>
  );
}

type RankingBreakdownView = {
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
  createdAt: string;
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
  const [sortOption, setSortOption] = useState("rank");
  const t = themeTokens[theme];

  const visible = useMemo(() => {
    const filtered = courses.filter((course) => {
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

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.priceCents - b.priceCents;
        case "price-desc":
          return b.priceCents - a.priceCents;
        case "freshness":
          return (
            new Date(b.lastUpdatedAt).getTime() -
            new Date(a.lastUpdatedAt).getTime()
          );
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "rating":
          return b.ratingAvg - a.ratingAvg;
        case "popularity":
          return b.enrollments - a.enrollments;
        default:
          return b.finalScore - a.finalScore;
      }
    });

    return sorted;
  }, [
    courses,
    selectedCategory,
    priceFilter,
    practiceFilter,
    sponsoredFilter,
    sortOption,
  ]);

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
          <h1 style={{ marginBottom: "10px" }}>Course List</h1>
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
          <label style={{ fontSize: "14px", color: t.muted }}>
            Sort
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              style={{
                marginLeft: "8px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: `1px solid ${t.border}`,
                background: t.card,
                color: t.text,
              }}
            >
              <option value="rank">FinalRankScore (default)</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="freshness">Freshness (recent updates)</option>
              <option value="newest">Newest (created)</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity (enrollments)</option>
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
              {course.category} • {course.priceCents === 0 ? "Free" : "Paid"} •{" "}
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
              <div>
                Calculated values:{" "}
                <HoverLabel
                  label="Q"
                  description="Quality score: rating normalized to 0–1 and scaled by rating confidence."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.qualityScore.toFixed(3)} ·{" "}
                <HoverLabel
                  label="P"
                  description="Popularity score: enrollments normalized across the dataset."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.popularityScore.toFixed(3)} ·{" "}
                <HoverLabel
                  label="F"
                  description="Freshness score: recency of last update normalized to 0–1."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.freshnessScore.toFixed(3)} ·{" "}
                <HoverLabel
                  label="E"
                  description="Editorial boost: extra weight for Sponsored or Editor’s Choice."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.editorialBoost.toFixed(3)}
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontWeight: 600, color: t.text }}>
                  Base formula:
                </span>{" "}
                <HoverLabel
                  label="Base = (Q × wQ) + (P × wP) + (F × wF)"
                  description="Weights are configurable in the admin panel."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                  href="/admin"
                />
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                Base calc: ({course.breakdown.qualityScore.toFixed(3)}×
                {course.breakdown.qualityWeight.toFixed(2)}) + (
                {course.breakdown.popularityScore.toFixed(3)}×
                {course.breakdown.popularityWeight.toFixed(2)}) + (
                {course.breakdown.freshnessScore.toFixed(3)}×
                {course.breakdown.freshnessWeight.toFixed(2)}) ={" "}
                {(
                  course.breakdown.qualityScore * course.breakdown.qualityWeight
                ).toFixed(3)}{" "}
                +{" "}
                {(
                  course.breakdown.popularityScore *
                  course.breakdown.popularityWeight
                ).toFixed(3)}{" "}
                +{" "}
                {(
                  course.breakdown.freshnessScore *
                  course.breakdown.freshnessWeight
                ).toFixed(3)}{" "}
                = {course.breakdown.baseScore.toFixed(3)}
              </div>
              <div>
                <HoverLabel
                  label="Base"
                  description="Base score before editorial boost is applied."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.baseScore.toFixed(3)}
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontWeight: 600, color: t.text }}>
                  Final formula:
                </span>{" "}
                <HoverLabel
                  label={`Final = Base + (E × ${course.breakdown.editorialWeight.toFixed(2)})`}
                  description="PoC-only transparency. Weights are configurable in the admin panel."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                  href="/admin"
                />
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                Final calc: {course.breakdown.baseScore.toFixed(3)} + (
                {course.breakdown.editorialBoost.toFixed(3)}×
                {course.breakdown.editorialWeight.toFixed(2)}) ={" "}
                {course.breakdown.baseScore.toFixed(3)} +{" "}
                {(
                  course.breakdown.editorialBoost *
                  course.breakdown.editorialWeight
                ).toFixed(3)}{" "}
                = {course.breakdown.finalScore.toFixed(3)}
              </div>
              <div>
                <HoverLabel
                  label="Final"
                  description="Final score after adding editorial boost."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.finalScore.toFixed(3)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "310px",
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
