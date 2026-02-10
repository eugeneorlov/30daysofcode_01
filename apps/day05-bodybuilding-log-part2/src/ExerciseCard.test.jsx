import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ExerciseCard } from "./ExerciseCard";

const exercise = { id: "bench-press", name: "Bench Press", muscle: "Chest" };
const sets = [
  { weight: 135, reps: 10 },
  { weight: 185, reps: 8 },
];

describe("ExerciseCard", () => {
  it("renders exercise name and muscle group", () => {
    render(
      <ExerciseCard
        exercise={exercise}
        sets={[]}
        onAddSet={() => {}}
        onRemoveSet={() => {}}
        onRemoveExercise={() => {}}
      />
    );
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Chest")).toBeInTheDocument();
  });

  it("renders existing sets with weight and reps", () => {
    render(
      <ExerciseCard
        exercise={exercise}
        sets={sets}
        onAddSet={() => {}}
        onRemoveSet={() => {}}
        onRemoveExercise={() => {}}
      />
    );
    expect(screen.getByText("135 lbs")).toBeInTheDocument();
    expect(screen.getByText("10 reps")).toBeInTheDocument();
    expect(screen.getByText("185 lbs")).toBeInTheDocument();
    expect(screen.getByText("8 reps")).toBeInTheDocument();
  });

  it("shows total volume", () => {
    render(
      <ExerciseCard
        exercise={exercise}
        sets={sets}
        onAddSet={() => {}}
        onRemoveSet={() => {}}
        onRemoveExercise={() => {}}
      />
    );
    // 135*10 + 185*8 = 1350 + 1480 = 2830
    expect(screen.getByText(/2,830 lbs/)).toBeInTheDocument();
  });

  it("calls onAddSet with weight and reps", () => {
    const onAddSet = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        sets={[]}
        onAddSet={onAddSet}
        onRemoveSet={() => {}}
        onRemoveExercise={() => {}}
      />
    );
    fireEvent.change(screen.getByTestId("weight-input-bench-press"), {
      target: { value: "225" },
    });
    fireEvent.change(screen.getByTestId("reps-input-bench-press"), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText("Add Set"));
    expect(onAddSet).toHaveBeenCalledWith("bench-press", { weight: 225, reps: 5 });
  });

  it("does not call onAddSet with zero values", () => {
    const onAddSet = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        sets={[]}
        onAddSet={onAddSet}
        onRemoveSet={() => {}}
        onRemoveExercise={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Add Set"));
    expect(onAddSet).not.toHaveBeenCalled();
  });

  it("calls onRemoveExercise when Remove is clicked", () => {
    const onRemoveExercise = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        sets={[]}
        onAddSet={() => {}}
        onRemoveSet={() => {}}
        onRemoveExercise={onRemoveExercise}
      />
    );
    fireEvent.click(screen.getByText("Remove"));
    expect(onRemoveExercise).toHaveBeenCalledWith("bench-press");
  });
});
