import { prisma } from "@/lib/prisma";
import { rankCourses, type RankedCourse } from "@/lib/ranking";
import CourseList from "@/components/CourseList";
import TopNav from "@/components/TopNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const settings = await prisma.settings.findFirst();
  const courses = await prisma.course.findMany();

  if (!settings) {
    return (
      <main style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
        <TopNav text="Go to admin view" href="/admin" />
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
      priceCents: course.priceCents,
      hasPractice: course.hasPractice,
      ratingAvg: course.ratingAvg,
      ratingCount: course.ratingCount,
      enrollments: course.enrollments,
      lastUpdatedAt: course.lastUpdatedAt,
      createdAt: course.createdAt,
      isSponsored: course.isSponsored,
      isEditorsChoice: course.isEditorsChoice,
      isAccredited: course.isAccredited,
      promoStart: course.promoStart,
      promoEnd: course.promoEnd,
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
        qualityWeight: 0,
        popularityWeight: 0,
        freshnessWeight: 0,
        editorialWeight: 0,
      },
    })) as RankedCourse[],
    settings
  );

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  ).sort();

  return (
    <div style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
      <TopNav text="Go to admin view" href="/admin" />
      <CourseList
        courses={ranked.map((course) => ({
          ...course,
          lastUpdatedAt: course.lastUpdatedAt.toISOString(),
          createdAt: course.createdAt.toISOString(),
        }))}
        categories={categories}
      />
    </div>
  );
}
