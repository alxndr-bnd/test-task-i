import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

type CourseSeed = {
  title: string;
  category: string;
  language: string;
  level: string;
  priceCents: number;
  isFree: boolean;
  durationMinutes: number;
  hasPractice: boolean;
  hasCertificate: boolean;
  isAccredited: boolean;
  isEditorsChoice: boolean;
  isSponsored: boolean;
  promoStart?: Date | null;
  promoEnd?: Date | null;
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  lastUpdatedAt: Date;
};

const categories = [
  "Programming",
  "Data Science",
  "Design",
  "Marketing",
  "Soft Skills",
  "Compliance",
];

const languages = ["English", "Spanish", "German"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const SEED = 20260128;
const BASE_DATE = new Date("2026-01-28T00:00:00.000Z");

const mulberry32 = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const random = mulberry32(SEED);

const rand = (min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min;

const pick = <T,>(items: T[]) => items[rand(0, items.length - 1)];

const daysAgo = (n: number) =>
  new Date(BASE_DATE.getTime() - n * 24 * 60 * 60 * 1000);

const makeCourse = (index: number): CourseSeed => {
  const isFree = random() < 0.2;
  const ratingAvg = Math.round((2.5 + random() * 2.4) * 10) / 10;
  const ratingCount = rand(5, 800);
  const enrollments = rand(20, 20000);
  const days = rand(0, 720);

  return {
    title: `Course ${index + 1}: ${pick(["Essentials", "Foundations", "Bootcamp", "Mastery"])}`,
    category: pick(categories),
    language: pick(languages),
    level: pick(levels),
    priceCents: isFree ? 0 : rand(1999, 19999),
    isFree,
    durationMinutes: rand(60, 1200),
    hasPractice: random() < 0.5,
    hasCertificate: random() < 0.6,
    isAccredited: random() < 0.25,
    isEditorsChoice: random() < 0.15,
    isSponsored: random() < 0.15,
    promoStart: random() < 0.2 ? daysAgo(rand(1, 30)) : null,
    promoEnd: random() < 0.2 ? daysAgo(-rand(1, 30)) : null,
    ratingAvg,
    ratingCount,
    enrollments,
    lastUpdatedAt: daysAgo(days),
  };
};

const edgeCases: CourseSeed[] = [
  {
    title: "Edge: High Rating, Low Enrollments",
    category: "Programming",
    language: "English",
    level: "Advanced",
    priceCents: 12999,
    isFree: false,
    durationMinutes: 480,
    hasPractice: true,
    hasCertificate: true,
    isAccredited: true,
    isEditorsChoice: false,
    isSponsored: false,
    promoStart: null,
    promoEnd: null,
    ratingAvg: 4.9,
    ratingCount: 120,
    enrollments: 45,
    lastUpdatedAt: daysAgo(30),
  },
  {
    title: "Edge: High Enrollments, Average Rating",
    category: "Marketing",
    language: "English",
    level: "Beginner",
    priceCents: 4999,
    isFree: false,
    durationMinutes: 240,
    hasPractice: false,
    hasCertificate: false,
    isAccredited: false,
    isEditorsChoice: false,
    isSponsored: false,
    promoStart: null,
    promoEnd: null,
    ratingAvg: 3.6,
    ratingCount: 900,
    enrollments: 18000,
    lastUpdatedAt: daysAgo(120),
  },
  {
    title: "Edge: Recently Updated, Low Popularity",
    category: "Data Science",
    language: "English",
    level: "Intermediate",
    priceCents: 8999,
    isFree: false,
    durationMinutes: 360,
    hasPractice: true,
    hasCertificate: true,
    isAccredited: false,
    isEditorsChoice: true,
    isSponsored: false,
    promoStart: daysAgo(3),
    promoEnd: daysAgo(-7),
    ratingAvg: 4.2,
    ratingCount: 60,
    enrollments: 120,
    lastUpdatedAt: daysAgo(2),
  },
  {
    title: "Edge: Popular but Outdated",
    category: "Design",
    language: "Spanish",
    level: "Beginner",
    priceCents: 2999,
    isFree: false,
    durationMinutes: 180,
    hasPractice: false,
    hasCertificate: true,
    isAccredited: false,
    isEditorsChoice: false,
    isSponsored: false,
    promoStart: null,
    promoEnd: null,
    ratingAvg: 4.1,
    ratingCount: 500,
    enrollments: 14000,
    lastUpdatedAt: daysAgo(650),
  },
  {
    title: "Edge: Sponsored Near Quality Floor",
    category: "Compliance",
    language: "English",
    level: "Intermediate",
    priceCents: 10999,
    isFree: false,
    durationMinutes: 300,
    hasPractice: true,
    hasCertificate: true,
    isAccredited: true,
    isEditorsChoice: false,
    isSponsored: true,
    promoStart: daysAgo(1),
    promoEnd: daysAgo(-5),
    ratingAvg: 3.5,
    ratingCount: 40,
    enrollments: 600,
    lastUpdatedAt: daysAgo(40),
  },
];

const settingsSeed = {
  qualityWeight: 0.45,
  popularityWeight: 0.25,
  freshnessWeight: 0.2,
  editorialWeight: 0.1,
  qualityFloor: 3.5,
  promotionCap: 5,
  sponsoredBoost: 0.2,
  editorsChoiceBoost: 0.15,
  minRatingsForConfidence: 30,
  freshnessMaxAgeDays: 365,
};

async function main() {
  const baseCourses = Array.from({ length: 45 }, (_, i) => makeCourse(i));
  const courses = [...baseCourses, ...edgeCases];

  await prisma.course.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.course.createMany({ data: courses });
  await prisma.settings.create({ data: settingsSeed });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
