import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No user selected. Find a user to display on the left, or{" "}
      <Link to="2775" className="text-blue-500 underline">
        try looking up Cathadan.
      </Link>
    </p>
  );
}
