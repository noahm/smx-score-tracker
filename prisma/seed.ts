import type { Prisma } from "~/generated/client";
import { PrismaClient } from "~/generated/client";
import { refreshChartsForUser } from "~/models/scores.server";

const prisma = new PrismaClient();

interface Song {
  title: string;
  subtitle: string;
  artist: string;
  label: string;
  bpm: string;
  cover_path: string;
  genre: string;
  created_at: string;
  website: string;
  difficulties: {
    [chartIndex: number]: {
      difficulty: string;
      name: string;
    };
  };
}

interface SongData {
  [songId: string]: Song;
}

async function seed() {
  // cleanup the existing database
  await prisma.song.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.user.deleteMany().catch(() => {});

  const req = await fetch(`https://statmaniax.com/api/get_song_data`);
  const songsById: SongData = await req.json();

  for (const [songId, song] of Object.entries(songsById)) {
    await prisma.song.create({
      data: {
        id: songId,
        artist: song.artist,
        title: song.title,
        bpm: song.bpm,
        genre: song.genre,
        jacket: `https://ddr.tools/jackets/smx/${
          song.cover_path.split("/")[2]
        }.jpg`,
        charts: {
          create: Array.from(
            Object.entries(song.difficulties)
          ).map<Prisma.ChartCreateWithoutSongInput>(([idx, chart]) => ({
            diffIndex: +idx,
            diffLevel: +chart.difficulty,
          })),
        },
      },
    });
  }

  await refreshChartsForUser({ remoteId: "2775" });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
