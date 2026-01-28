import { prisma } from "@/lib/prisma";
import { rankCourses, type RankedCourse } from "@/lib/ranking";
import TopNav from "@/components/TopNav";
import AdminView from "@/app/admin/AdminView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const settings = await prisma.settings.findFirst();
  const courses = await prisma.course.findMany();

  if (!settings) {
    return (
      <main style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
        <TopNav text="Go to user view" href="/" />
        <h1>Admin</h1>
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
  );

  return (
    <div style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
      <TopNav text="Go to user view" href="/" />
      <AdminView
        settings={settings}
        ranked={ranked.map((course) => ({
          id: course.id,
          title: course.title,
          ratingAvg: course.ratingAvg,
          ratingCount: course.ratingCount,
          enrollments: course.enrollments,
          lastUpdatedAt: course.lastUpdatedAt.toISOString(),
          breakdown: course.breakdown,
        }))}
        qualityFloor={settings.qualityFloor}
      />
    </div>
  );
}
