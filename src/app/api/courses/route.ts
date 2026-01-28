import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    id,
    isSponsored,
    isEditorsChoice,
    isAccredited,
  } = body;

  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const settings = await prisma.settings.findFirst();
  if (settings && (isSponsored || isEditorsChoice)) {
    if (existing.ratingAvg < settings.qualityFloor) {
      return Response.json(
        {
          ok: false,
          error: `Quality too low for promotion (${existing.ratingAvg.toFixed(2)} < ${settings.qualityFloor.toFixed(2)})`,
        },
        { status: 400 }
      );
    }

    if ((isSponsored || isEditorsChoice) && settings.promotionCap > 0) {
      const promotedCount = await prisma.course.count({
        where: {
          id: { not: id },
          OR: [{ isSponsored: true }, { isEditorsChoice: true }],
        },
      });
      if (promotedCount >= settings.promotionCap) {
        return Response.json(
          {
            ok: false,
            error: `Promotion cap reached (${promotedCount}/${settings.promotionCap})`,
          },
          { status: 400 }
        );
      }
    }
  }

  const updated = await prisma.course.update({
    where: { id },
    data: {
      isSponsored: Boolean(isSponsored),
      isEditorsChoice: Boolean(isEditorsChoice),
      isAccredited: Boolean(isAccredited),
      promoStart: null,
      promoEnd: null,
    },
  });

  return Response.json({ ok: true, course: updated });
}
