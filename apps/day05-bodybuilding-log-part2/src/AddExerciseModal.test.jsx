import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AddExerciseModal } from "./AddExerciseModal";

describe("AddExerciseModal", () => {
  it("renders search input and filter buttons", () => {
    render(<AddExerciseModal onSelect={() => {}} onClose={() => {}} currentExerciseIds={[]} />);
    expect(screen.getByTestId("exercise-search")).toBeInTheDocument();
    expect(screen.getAllByText("All")).toHaveLength(2);
    expect(screen.getAllByText("Chest").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Bodybuilding")).toBeInTheDocument();
  });

  it("shows exercises grouped by muscle", () => {
    render(<AddExerciseModal onSelect={() => {}} onClose={() => {}} currentExerciseIds={[]} />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Deadlift")).toBeInTheDocument();
  });

  it("filters exercises by search text", () => {
    render(<AddExerciseModal onSelect={() => {}} onClose={() => {}} currentExerciseIds={[]} />);
    fireEvent.change(screen.getByTestId("exercise-search"), {
      target: { value: "curl" },
    });
    expect(screen.getByText("Barbell Curl")).toBeInTheDocument();
    expect(screen.getByText("Hammer Curl")).toBeInTheDocument();
    expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
  });

  it("filters by muscle group", () => {
    render(<AddExerciseModal onSelect={() => {}} onClose={() => {}} currentExerciseIds={[]} />);
    // Click the "Legs" muscle filter
    const muscleButtons = screen.getAllByText("Legs");
    fireEvent.click(muscleButtons[0]);
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
  });

  it("calls onSelect when exercise is clicked", () => {
    const onSelect = vi.fn();
    render(<AddExerciseModal onSelect={onSelect} onClose={() => {}} currentExerciseIds={[]} />);
    fireEvent.click(screen.getByText("Bench Press"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "bench-press", name: "Bench Press" })
    );
  });

  it("disables already-added exercises", () => {
    render(
      <AddExerciseModal
        onSelect={() => {}}
        onClose={() => {}}
        currentExerciseIds={["bench-press"]}
      />
    );
    const btn = screen.getByText("Bench Press").closest("button");
    expect(btn).toBeDisabled();
    expect(screen.getByText("Added")).toBeInTheDocument();
  });

  it("shows no results message", () => {
    render(<AddExerciseModal onSelect={() => {}} onClose={() => {}} currentExerciseIds={[]} />);
    fireEvent.change(screen.getByTestId("exercise-search"), {
      target: { value: "zzzzz" },
    });
    expect(screen.getByText("No exercises found.")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<AddExerciseModal onSelect={() => {}} onClose={onClose} currentExerciseIds={[]} />);
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalled();
  });
});
