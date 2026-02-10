import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HistoryPage } from "./HistoryPage";
import { renderWithProviders } from "./test/renderWithProviders";

beforeEach(() => {
  localStorage.clear();
});

describe("HistoryPage", () => {
  it("shows empty state when no sessions", () => {
    renderWithProviders(<HistoryPage />);
    expect(screen.getByText(/No workouts yet/)).toBeInTheDocument();
  });

  it("renders session history sorted newest first", () => {
    const sessions = [
      {
        date: "2026-02-01",
        trainingType: "Bodybuilding",
        duration: 3600,
        exercises: [
          { id: "squat", name: "Squat", muscle: "Legs", sets: [{ weight: 225, reps: 5 }] },
        ],
      },
      {
        date: "2026-02-05",
        trainingType: "Powerlifting",
        duration: 5400,
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
    localStorage.setItem("ironlog-sessions", JSON.stringify(sessions));

    renderWithProviders(<HistoryPage />);
    const dates = screen.getAllByText(/2026-02-/);
    expect(dates[0]).toHaveTextContent("2026-02-05");
    expect(dates[1]).toHaveTextContent("2026-02-01");
  });

  it("shows exercise names in session cards", () => {
    const sessions = [
      {
        date: "2026-02-01",
        trainingType: "Bodybuilding",
        duration: 3600,
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
    localStorage.setItem("ironlog-sessions", JSON.stringify(sessions));

    renderWithProviders(<HistoryPage />);
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });
});
