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
        id: 1738368000000,
        trainingType: "Bodybuilding",
        startedAt: "2026-02-01T10:00:00.000Z",
        endedAt: "2026-02-01T11:00:00.000Z",
        exercises: [
          { id: "squat", name: "Squat", muscle: "Legs", sets: [{ weight: 225, reps: 5 }] },
        ],
      },
      {
        id: 1738713600000,
        trainingType: "Powerlifting",
        startedAt: "2026-02-05T10:00:00.000Z",
        endedAt: "2026-02-05T11:30:00.000Z",
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
    const dates = screen.getAllByText(/Feb/);
    expect(dates[0]).toHaveTextContent("Feb");
    expect(dates[1]).toHaveTextContent("Feb");
  });

  it("shows exercise names in session cards", () => {
    const sessions = [
      {
        id: 1738368000000,
        trainingType: "Bodybuilding",
        startedAt: "2026-02-01T10:00:00.000Z",
        endedAt: "2026-02-01T11:00:00.000Z",
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
