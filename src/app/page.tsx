import { prisma } from "@/lib/prisma";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
      <h1 style={{ marginBottom: "16px" }}>Course List (Preview)</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Showing the latest 20 courses from the seeded database.
      </p>
      <div style={{ display: "grid", gap: "12px" }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px 16px",
            }}
          >
            <div style={{ fontWeight: 600 }}>{course.title}</div>
            <div style={{ fontSize: "14px", color: "#444" }}>
              {course.category} • {course.level} • {course.language}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              Rating {course.ratingAvg.toFixed(1)} ({course.ratingCount}) •
              Enrollments {course.enrollments} • Updated{" "}
              {course.lastUpdatedAt.toDateString()}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
