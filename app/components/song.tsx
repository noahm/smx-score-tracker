export interface SongCardProps {
  jacket: string;
  score: number;
  title: string;
  diffLevel: number;
  date: string;
}

export default function SongCard({
  score,
  jacket,
  title,
  diffLevel,
  date,
}: SongCardProps) {
  return (
    <div className="clear-left">
      <img
        src={jacket}
        height="50"
        width="50"
        alt="jacket"
        className="float-left"
      />
      [{diffLevel}] {title} - {score.toLocaleString()}
      <br />
      {new Date(date).toLocaleDateString()}
    </div>
  );
}
