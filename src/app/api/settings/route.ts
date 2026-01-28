import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const data = {
    qualityWeight: Number(body.qualityWeight),
    popularityWeight: Number(body.popularityWeight),
    freshnessWeight: Number(body.freshnessWeight),
    editorialWeight: Number(body.editorialWeight),
    qualityFloor: Number(body.qualityFloor),
    promotionCap: Number(body.promotionCap),
    sponsoredBoost: Number(body.sponsoredBoost),
    editorsChoiceBoost: Number(body.editorsChoiceBoost),
    minRatingsForConfidence: Number(body.minRatingsForConfidence),
    freshnessMaxAgeDays: Number(body.freshnessMaxAgeDays),
  };

  const existing = await prisma.settings.findFirst();
  if (existing) {
    const updated = await prisma.settings.update({
      where: { id: existing.id },
      data,
    });
    return Response.json({ ok: true, settings: updated });
  }

  const created = await prisma.settings.create({ data });
  return Response.json({ ok: true, settings: created });
}
