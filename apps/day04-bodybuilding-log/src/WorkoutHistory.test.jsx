import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WorkoutHistory } from "./WorkoutHistory";

describe("WorkoutHistory", () => {
  it("shows empty state when no workouts", () => {
    render(<WorkoutHistory workouts={[]} />);
    expect(screen.getByText("No workouts yet.")).toBeInTheDocument();
  });

  it("renders workout summaries sorted newest first", () => {
    const workouts = [
      {
        date: "2026-02-01",
        exercises: [
          { id: "squat", name: "Squat", muscle: "Legs", sets: [{ weight: 225, reps: 5 }] },
        ],
      },
      {
        date: "2026-02-05",
        exercises: [
          {
            id: "bench-press",
            name: "Bench Press",
            muscle: "Chest",
            sets: [{ weight: 135, reps: 10 }],
          },
        ],
      },
    ];
    render(<WorkoutHistory workouts={workouts} />);

    const dates = screen.getAllByText(/2026-02-/);
    expect(dates[0]).toHaveTextContent("2026-02-05");
    expect(dates[1]).toHaveTextContent("2026-02-01");
  });

  it("shows exercise names in summaries", () => {
    const workouts = [
      {
        date: "2026-02-01",
        exercises: [
          { id: "squat", name: "Squat", muscle: "Legs", sets: [{ weight: 225, reps: 5 }] },
          {
            id: "bench-press",
            name: "Bench Press",
            muscle: "Chest",
            sets: [{ weight: 135, reps: 10 }],
          },
        ],
      },
    ];
    render(<WorkoutHistory workouts={workouts} />);
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Exercises")).toBeInTheDocument();
  });
});
