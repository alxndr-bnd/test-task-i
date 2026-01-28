import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    id,
    isSponsored,
    isEditorsChoice,
    isAccredited,
    promoStart,
    promoEnd,
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

    const now = new Date();
    const nextPromoStart = promoStart ? new Date(promoStart) : null;
    const nextPromoEnd = promoEnd ? new Date(promoEnd) : null;
    const isActive =
      (isSponsored || isEditorsChoice) &&
      (!nextPromoStart || nextPromoStart <= now) &&
      (!nextPromoEnd || nextPromoEnd >= now);

    if (isActive && settings.promotionCap > 0) {
      const promotedCount = await prisma.course.count({
        where: {
          id: { not: id },
          OR: [{ isSponsored: true }, { isEditorsChoice: true }],
          AND: [
            {
              OR: [{ promoStart: null }, { promoStart: { lte: now } }],
            },
            {
              OR: [{ promoEnd: null }, { promoEnd: { gte: now } }],
            },
          ],
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
      promoStart: promoStart ? new Date(promoStart) : null,
      promoEnd: promoEnd ? new Date(promoEnd) : null,
    },
  });

  return Response.json({ ok: true, course: updated });
}
