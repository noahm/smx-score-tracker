import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import SongCard from "~/components/song";

import { getChartsForUser } from "~/models/scores.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.userId, "userId not found");

  const user = await getChartsForUser({ remoteId: params.userId });
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const scores: JSX.Element[] = [];
  for (const score of data.user.scores) {
    scores.push(
      <SongCard
        key={score.id}
        score={score.score}
        date={score.date}
        diffLevel={score.chart.diffLevel}
        jacket={score.song.jacket}
        title={score.song.title}
      />
    );
  }
  return <>{scores}</>;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
