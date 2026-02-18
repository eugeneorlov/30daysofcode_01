import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "./FilterBar";

const emptyFilters = { position: [], type: [], difficulty: [] };

describe("FilterBar", () => {
  it("renders all position chips", () => {
    render(<FilterBar filters={emptyFilters} onFiltersChange={() => {}} />);
    expect(screen.getByText("Guard")).toBeInTheDocument();
    expect(screen.getByText("Mount")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Standing")).toBeInTheDocument();
  });

  it("renders all type chips", () => {
    render(<FilterBar filters={emptyFilters} onFiltersChange={() => {}} />);
    expect(screen.getByText("Submission")).toBeInTheDocument();
    expect(screen.getByText("Sweep")).toBeInTheDocument();
    expect(screen.getByText("Escape")).toBeInTheDocument();
    expect(screen.getByText("Transition")).toBeInTheDocument();
    expect(screen.getByText("Control")).toBeInTheDocument();
  });

  it("renders all difficulty chips", () => {
    render(<FilterBar filters={emptyFilters} onFiltersChange={() => {}} />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("calls onFiltersChange when a chip is clicked", () => {
    const handleChange = vi.fn();
    render(<FilterBar filters={emptyFilters} onFiltersChange={handleChange} />);
    fireEvent.click(screen.getByText("Guard"));
    expect(handleChange).toHaveBeenCalledWith({
      ...emptyFilters,
      position: ["Guard"],
    });
  });

  it("deselects an active chip when clicked again", () => {
    const handleChange = vi.fn();
    const filtersWithGuard = { ...emptyFilters, position: ["Guard"] };
    render(<FilterBar filters={filtersWithGuard} onFiltersChange={handleChange} />);
    fireEvent.click(screen.getByText("Guard"));
    expect(handleChange).toHaveBeenCalledWith({
      ...emptyFilters,
      position: [],
    });
  });

  it("marks selected chips with aria-pressed=true", () => {
    const filtersWithGuard = { ...emptyFilters, position: ["Guard"] };
    render(<FilterBar filters={filtersWithGuard} onFiltersChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Guard" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Mount" })).toHaveAttribute("aria-pressed", "false");
  });
});
