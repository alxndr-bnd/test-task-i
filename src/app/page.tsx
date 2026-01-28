import { prisma } from "@/lib/prisma";
import { rankCourses, type RankedCourse } from "@/lib/ranking";
import CourseList from "@/components/CourseList";

export default async function Home() {
  const settings = await prisma.settings.findFirst();
  const courses = await prisma.course.findMany();

  if (!settings) {
    return (
      <main style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
        <h1>Course List</h1>
        <p>No settings found. Run the seed script.</p>
      </main>
    );
  }

  const ranked = rankCourses(
    courses.map((course) => ({
      id: course.id,
      title: course.title,
      category: course.category,
      level: course.level,
      language: course.language,
      ratingAvg: course.ratingAvg,
      ratingCount: course.ratingCount,
      enrollments: course.enrollments,
      lastUpdatedAt: course.lastUpdatedAt,
      isSponsored: course.isSponsored,
      isEditorsChoice: course.isEditorsChoice,
      isAccredited: course.isAccredited,
      finalScore: 0,
      reason: "",
      breakdown: {
        qualityScore: 0,
        popularityScore: 0,
        freshnessScore: 0,
        editorialBoost: 0,
        baseScore: 0,
        finalScore: 0,
        formula: "",
      },
    })) as RankedCourse[],
    settings
  ).slice(0, 20);

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  ).sort();

  return (
    <CourseList
      courses={ranked.map((course) => ({
        ...course,
        lastUpdatedAt: course.lastUpdatedAt.toISOString(),
      }))}
      categories={categories}
    />
  );
}
