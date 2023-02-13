import type { Prisma, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Score } from "@prisma/client";

export type ScoreWithSongAndChart = Prisma.ScoreGetPayload<{
  include: { song: true; chart: true };
}>;

interface RawScore {
  song_id: string;
  song_chart_id: string;
  game_song_id: string;
  difficulty_id: string;
  title: string;
  artist: string;
  difficulty: string;
  date: string;
  score: string;
  flags: string;
  perfect1: string;
  perfect2: string;
  early: string;
  green: string;
  yellow: string;
  red: string;
  late: string;
  misses: string;
  grade: string;
}

interface Scores {
  [songChartId: string]: RawScore;
}

export type Diff = "beginner" | "easy" | "hard" | "wild" | "dual" | "full";

/**
 * Note that to genericize a difficulty index, just compute idx % 6
 */
export enum DiffIndex {
  beginner,
  easy,
  hard,
  wild,
  dual,
  full,
  team, // not in our data because scores don't save... :shruggie:
  beginner_plus,
  easy_plus,
  hard_plus,
  wild_plus,
  dual_plus,
  full_plus,
}

export async function getScoresForUser(userId: string, difficulty: Diff) {
  const req = await fetch(
    `https://statmaniax.com/api/get_user_highscores_info/${userId}/${difficulty}`
  );
  if (req.ok) {
    const resp = await req.json();
    if (resp.scores) {
      return resp.scores as Scores;
    }
  }
}

export function getChartsForUser({ remoteId }: Pick<User, "remoteId">) {
  const user = prisma.user.findFirst({
    where: { remoteId },
    include: {
      scores: {
        include: {
          song: true,
          chart: true,
        },
      },
    },
  });
  if (user) {
    return user;
  }
  return refreshChartsForUser({ remoteId });
}

export async function refreshChartsForUser({
  remoteId,
}: Pick<User, "remoteId">) {
  const remoteScores = await getScoresForUser(remoteId, "wild");
  if (!remoteScores) {
    return;
  }

  await prisma.user.upsert({
    where: {
      remoteId,
    },
    create: {
      remoteId,
    },
    update: {},
  });

  const scores = Array.from(
    Object.values(remoteScores)
  ).map<Prisma.ScoreCreateInput>((s) => ({
    user: {
      connect: {
        remoteId,
      },
    },
    date: new Date(s.date),
    score: +s.score,
    flags: s.flags,
    difficultyId: +s.difficulty_id,
    early: s.early,
    late: s.late,
    perfect1: s.perfect1,
    perfect2: s.perfect2,
    green: s.green,
    yellow: s.yellow,
    red: s.red,
    misses: s.misses,
    grade: s.grade,
    song: {
      connect: {
        id: s.song_id,
      },
    },
    chart: {
      connect: {
        songId_diffIndex: {
          songId: s.song_id,
          diffIndex: +s.difficulty_id,
        },
      },
    },
  }));

  for (const score of scores) {
    await prisma.score.create({
      data: score,
    });
  }

  return prisma.user.findFirstOrThrow({
    where: { remoteId },
    include: {
      scores: {
        include: {
          song: true,
          chart: true,
        },
      },
    },
  });
}
