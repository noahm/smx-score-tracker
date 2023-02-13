import { render, screen } from "@testing-library/react";
import type { SongCardProps } from "./song";
import SongCard from "./song";

describe("SongCard", () => {
  const defaultProps: SongCardProps = {
    date: "1970-01-01 05:37:00",
    diffLevel: 10,
    jacket: "foo/bar.jpg",
    score: 99123,
    title: "Test Song",
  };
  test("renders a jacket image", async () => {
    render(<SongCard {...defaultProps} />);
    const img = await screen.findByAltText(/jacket/);
    expect(img).toBeInTheDocument();
  });
});
