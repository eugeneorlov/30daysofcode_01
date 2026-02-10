import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";
import * as useUserModule from "./context/useUser";

// Mock Recharts components
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Bar: () => <div />,
  Line: () => <div />,
  Pie: () => <div />,
  Cell: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

describe("DashboardPage", () => {
  const mockSessions = [
    {
      id: 1,
      trainingType: "bodybuilding",
      startedAt: "2024-01-10T10:00:00Z",
      endedAt: "2024-01-10T10:45:00Z",
      exercises: [
        {
          id: "bench",
          name: "Bench Press",
          muscleGroup: "chest",
          sets: [
            { weight: 100, reps: 10 },
            { weight: 110, reps: 8 },
          ],
        },
      ],
    },
    {
      id: 2,
      trainingType: "powerlifting",
      startedAt: "2024-01-15T14:00:00Z",
      endedAt: "2024-01-15T15:00:00Z",
      exercises: [
        {
          id: "deadlift",
          name: "Deadlift",
          muscleGroup: "back",
          sets: [{ weight: 200, reps: 3 }],
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no sessions exist", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: [],
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/No workouts logged yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Session/i)).toBeInTheDocument();
  });

  it("renders stats overview with session data", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Should show total sessions (there may be multiple "2" on the page - stats and charts)
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("Total Sessions")).toBeInTheDocument();

    // Should show stats cards
    expect(screen.getByText("Total Volume")).toBeInTheDocument();
    expect(screen.getByText("Avg Duration")).toBeInTheDocument();
    expect(screen.getByText("Est. Calories")).toBeInTheDocument();
  });

  it("renders volume chart with session data", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Volume by Session")).toBeInTheDocument();
    expect(screen.getAllByTestId("bar-chart")).toHaveLength(2); // Volume + MuscleGroup
  });

  it("renders duration chart", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Duration Trend")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("renders type distribution chart", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Training Type Distribution")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders muscle group chart", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Muscle Group Focus")).toBeInTheDocument();
  });

  it("calculates correct total volume", () => {
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      sessions: mockSessions,
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Session 1: (100*10 + 110*8) = 1880
    // Session 2: (200*3) = 600
    // Total: 2480
    expect(screen.getByText("2,480 kg")).toBeInTheDocument();
  });
});
