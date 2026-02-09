import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ExerciseSelector } from "./ExerciseSelector";

describe("ExerciseSelector", () => {
  it("renders exercise list grouped by muscle", () => {
    render(<ExerciseSelector onSelect={() => {}} currentExerciseIds={[]} />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Deadlift")).toBeInTheDocument();
  });

  it("filters exercises by search text", () => {
    render(<ExerciseSelector onSelect={() => {}} currentExerciseIds={[]} />);
    fireEvent.change(screen.getByTestId("exercise-search"), {
      target: { value: "curl" },
    });
    expect(screen.getByText("Barbell Curl")).toBeInTheDocument();
    expect(screen.getByText("Hammer Curl")).toBeInTheDocument();
    expect(screen.getByText("Leg Curl")).toBeInTheDocument();
    expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
  });

  it("filters exercises by muscle group", () => {
    render(<ExerciseSelector onSelect={() => {}} currentExerciseIds={[]} />);
    // There are multiple "Chest" texts (muscle group heading + filter button).
    // Click the filter button specifically.
    const chestButtons = screen.getAllByText("Chest");
    // The filter pill button is the first one rendered in the filter row
    fireEvent.click(chestButtons[0]);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.queryByText("Squat")).not.toBeInTheDocument();
  });

  it("calls onSelect when an exercise is clicked", () => {
    const onSelect = vi.fn();
    render(<ExerciseSelector onSelect={onSelect} currentExerciseIds={[]} />);
    fireEvent.click(screen.getByText("Bench Press"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "bench-press", name: "Bench Press" })
    );
  });

  it("disables already-added exercises", () => {
    render(<ExerciseSelector onSelect={() => {}} currentExerciseIds={["bench-press"]} />);
    const btn = screen.getByText("Bench Press").closest("button");
    expect(btn).toBeDisabled();
    expect(screen.getByText("Added")).toBeInTheDocument();
  });

  it("shows no results message when nothing matches", () => {
    render(<ExerciseSelector onSelect={() => {}} currentExerciseIds={[]} />);
    fireEvent.change(screen.getByTestId("exercise-search"), {
      target: { value: "zzzzz" },
    });
    expect(screen.getByText("No exercises found.")).toBeInTheDocument();
  });
});
