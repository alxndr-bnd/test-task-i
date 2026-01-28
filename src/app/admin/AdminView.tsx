"use client";

import { useMemo, useState } from "react";

type HoverLabelProps = {
  label: string;
  description: string;
  textColor: string;
  borderColor: string;
  bg: string;
};

function HoverLabel({
  label,
  description,
  textColor,
  borderColor,
  bg,
}: HoverLabelProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      style={{ position: "relative", fontWeight: 600, color: textColor }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {label}
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

type RankedCourseView = {
  id: string;
  title: string;
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  lastUpdatedAt: string;
  isSponsored: boolean;
  isEditorsChoice: boolean;
  isAccredited: boolean;
  breakdown: {
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
  promoAppliedCount: number;
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

export default function AdminView({
  settings,
  ranked,
  qualityFloor,
  promoAppliedCount,
}: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const t = themeTokens[theme];
  const [coursesState, setCoursesState] = useState(ranked);
  const [courseStatus, setCourseStatus] = useState<Record<string, string>>({});
  const [form, setForm] = useState(settings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const fields = useMemo(
    () => [
      ["qualityWeight", "Quality weight"],
      ["popularityWeight", "Popularity weight"],
      ["freshnessWeight", "Freshness weight"],
      ["editorialWeight", "Editorial weight"],
      ["qualityFloor", "Quality floor"],
      ["promotionCap", "Promotion cap"],
      ["sponsoredBoost", "Sponsored boost"],
      ["editorsChoiceBoost", "Editor’s Choice boost"],
      ["minRatingsForConfidence", "Min ratings for confidence"],
      ["freshnessMaxAgeDays", "Freshness max age (days)"],
    ],
    []
  );

  const fieldHelp: Record<string, string> = {
    qualityWeight: "Weight for Quality score in Base.",
    popularityWeight: "Weight for Popularity score in Base.",
    freshnessWeight: "Weight for Freshness score in Base.",
    editorialWeight: "Multiplier applied to editorial boosts.",
    qualityFloor: "Minimum rating required for promotion.",
    promotionCap: "Max promoted courses per page.",
    sponsoredBoost: "Boost added for Sponsored courses.",
    editorsChoiceBoost: "Boost added for Editor’s Choice.",
    minRatingsForConfidence: "Rating count threshold for confidence.",
    freshnessMaxAgeDays: "Age (days) at which freshness becomes 0.",
  };

  const onSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
      window.location.reload();
    } catch (error) {
      setStatus("error");
    }
  };

  const updateCourse = (id: string, patch: Partial<RankedCourseView>) => {
    setCoursesState((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, ...patch } : course
      )
    );
  };


  const saveCourse = async (course: RankedCourseView) => {
    setCourseStatus((prev) => ({ ...prev, [course.id]: "saving" }));
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          isSponsored: course.isSponsored,
          isEditorsChoice: course.isEditorsChoice,
          isAccredited: course.isAccredited,
          promoStart: null,
          promoEnd: null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setCourseStatus((prev) => ({
          ...prev,
          [course.id]: data.error || "Save failed",
        }));
        return;
      }
      setCourseStatus((prev) => ({ ...prev, [course.id]: "saved" }));
      setTimeout(
        () =>
          setCourseStatus((prev) => ({
            ...prev,
            [course.id]: "",
          })),
        1500
      );
    } catch (error) {
      setCourseStatus((prev) => ({ ...prev, [course.id]: "Save failed" }));
    }
  };

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
          marginBottom: "12px",
        }}
      >
        <h1 style={{ margin: 0 }}>Admin Panel</h1>
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
        <p style={{ marginTop: 0, color: t.muted }}>
          These parameters control how the ranking score is computed in the
          PoC.
        </p>
        <div style={{ marginBottom: "10px", color: t.muted }}>
          Promotion cap usage: {promoAppliedCount}/{settings.promotionCap}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {fields.map(([key, label]) => (
            <label
              key={key}
              style={{ display: "grid", gap: "6px", fontSize: "13px" }}
            >
              <span style={{ color: t.muted, display: "flex", gap: "6px" }}>
                {label}
                <HoverLabel
                  label="?"
                  description={fieldHelp[key]}
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
              </span>
              <input
                type="number"
                step="0.01"
                value={form[key as keyof SettingsView]}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [key]: Number(event.target.value),
                  }))
                }
                style={{
                  border: `1px solid ${t.border}`,
                  borderRadius: "8px",
                  padding: "6px 8px",
                }}
              />
            </label>
          ))}
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onSave}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: `1px solid ${t.border}`,
              background: t.card,
              color: t.text,
              cursor: "pointer",
            }}
          >
            Save settings
          </button>
          {status === "saving" && <span>Saving...</span>}
          {status === "saved" && <span>Saved</span>}
          {status === "error" && <span>Save failed</span>}
        </div>
      </section>
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "220px",
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
        <div style={{ fontWeight: 600, color: t.text, marginBottom: "6px" }}>
          Settings legend
        </div>
        <div>Quality weight: how much rating quality impacts Base.</div>
        <div>Popularity weight: how much enrollments impact Base.</div>
        <div>Freshness weight: how much recency impacts Base.</div>
        <div>Editorial weight: multiplier applied to editorial boosts.</div>
        <div>Quality floor: minimum rating required for promotion.</div>
        <div>Promotion cap: maximum promoted courses per page.</div>
        <div>Sponsored boost: boost applied to Sponsored courses.</div>
        <div>Editor’s Choice boost: boost applied to Editor’s Choice.</div>
        <div>Min ratings for confidence: rating count threshold.</div>
        <div>Freshness max age (days): age at which freshness becomes 0.</div>
        <div style={{ marginTop: "8px" }}>
          Example Q: rating 4.5/5 ≈ 0.88, then scaled by confidence where
          confidence = min(ratingCount / minRatingsForConfidence, 1.0).
        </div>
        <div>Example P: 12,000 enrollments close to dataset max ≈ 0.90.</div>
        <div>Example F: updated 30 days ago on 365‑day scale ≈ 0.92.</div>
      </div>

      <section>
        <h2>Ranking Breakdown</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {coursesState.map((course, index) => (
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "10px",
                  margin: "8px 0 6px",
                  fontSize: "12px",
                  color: t.muted,
                }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={course.isSponsored}
                    onChange={(event) =>
                      updateCourse(course.id, {
                        isSponsored: event.target.checked,
                      })
                    }
                  />{" "}
                  Sponsored
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={course.isEditorsChoice}
                    onChange={(event) =>
                      updateCourse(course.id, {
                        isEditorsChoice: event.target.checked,
                      })
                    }
                  />{" "}
                  Editor’s Choice
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={course.isAccredited}
                    onChange={(event) =>
                      updateCourse(course.id, {
                        isAccredited: event.target.checked,
                      })
                    }
                  />{" "}
                  Accredited
                </label>
                <button
                  type="button"
                  onClick={() => saveCourse(course)}
                  style={{
                    height: "32px",
                    alignSelf: "end",
                    borderRadius: "999px",
                    border: `1px solid ${t.border}`,
                    background: t.card,
                    color: t.text,
                    cursor: "pointer",
                  }}
                >
                  Save course
                </button>
                {courseStatus[course.id] && (
                  <span style={{ alignSelf: "end" }}>
                    {courseStatus[course.id]}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
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
              <div style={{ marginTop: "6px", fontSize: "12px", color: t.muted }}>
                Base formula: Base = (Q × wQ) + (P × wP) + (F × wF)
              </div>
              <div style={{ fontSize: "12px", color: t.muted }}>
                Base calc: ({course.breakdown.qualityScore.toFixed(3)}×
                {course.breakdown.qualityWeight.toFixed(2)}) + (
                {course.breakdown.popularityScore.toFixed(3)}×
                {course.breakdown.popularityWeight.toFixed(2)}) + (
                {course.breakdown.freshnessScore.toFixed(3)}×
                {course.breakdown.freshnessWeight.toFixed(2)}) ={" "}
                {(
                  course.breakdown.qualityScore *
                  course.breakdown.qualityWeight
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
              <div style={{ fontSize: "12px", color: t.muted }}>
                <HoverLabel
                  label="Base"
                  description="Base score before editorial boost is applied."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.baseScore.toFixed(3)}
              </div>
              <div style={{ marginTop: "6px", fontSize: "12px", color: t.muted }}>
                Final formula: Final = Base + (E ×{" "}
                {course.breakdown.editorialWeight.toFixed(2)})
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
              <div style={{ fontSize: "12px", color: t.muted }}>
                <HoverLabel
                  label="Final"
                  description="Final score after adding editorial boost."
                  textColor={t.text}
                  borderColor={t.border}
                  bg={t.card}
                />
                ={course.breakdown.finalScore.toFixed(3)}
              </div>
              {course.ratingAvg < qualityFloor && (
                <div style={{ color: "#b00020", fontSize: "12px" }}>
                  Warning: Quality too low for promotion (uses raw ratingAvg:{" "}
                  {course.ratingAvg.toFixed(2)} &lt; {qualityFloor.toFixed(2)})
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
