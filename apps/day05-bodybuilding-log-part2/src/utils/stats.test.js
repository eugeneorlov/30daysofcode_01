import { describe, it, expect } from "vitest";
import {
  calcTotalVolume,
  calcAvgDuration,
  calcEstimatedCalories,
  calcTotalCalories,
  calcMuscleGroupSets,
  calcTypeDistribution,
  formatDuration,
  formatNumber,
  getLastSessions,
  getSessionDuration,
  getSessionVolume,
  formatChartDate,
  getFavoriteType,
  getMemberSince,
} from "./stats";

describe("stats utility functions", () => {
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
        {
          id: "squat",
          name: "Squat",
          muscleGroup: "legs",
          sets: [{ weight: 150, reps: 5 }],
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
          sets: [
            { weight: 200, reps: 3 },
            { weight: 220, reps: 1 },
          ],
        },
      ],
    },
  ];

  describe("calcTotalVolume", () => {
    it("calculates total volume across all sessions", () => {
      // Session 1: (100*10 + 110*8 + 150*5) = 1000 + 880 + 750 = 2630
      // Session 2: (200*3 + 220*1) = 600 + 220 = 820
      // Total: 3450
      expect(calcTotalVolume(mockSessions)).toBe(3450);
    });

    it("returns 0 for empty sessions", () => {
      expect(calcTotalVolume([])).toBe(0);
      expect(calcTotalVolume(null)).toBe(0);
    });
  });

  describe("calcAvgDuration", () => {
    it("calculates average session duration in minutes", () => {
      // Session 1: 45 minutes
      // Session 2: 60 minutes
      // Average: 52.5 rounded to 53
      expect(calcAvgDuration(mockSessions)).toBe(53);
    });

    it("returns 0 for empty sessions", () => {
      expect(calcAvgDuration([])).toBe(0);
      expect(calcAvgDuration(null)).toBe(0);
    });
  });

  describe("calcEstimatedCalories", () => {
    it("calculates calories for bodybuilding session (5 cal/min)", () => {
      const calories = calcEstimatedCalories(mockSessions[0]);
      // 45 minutes * 5 cal/min = 225
      expect(calories).toBe(225);
    });

    it("calculates calories for powerlifting session (6 cal/min)", () => {
      const calories = calcEstimatedCalories(mockSessions[1]);
      // 60 minutes * 6 cal/min = 360
      expect(calories).toBe(360);
    });

    it("returns 0 for session without timestamps", () => {
      expect(calcEstimatedCalories({})).toBe(0);
    });
  });

  describe("calcTotalCalories", () => {
    it("sums calories across all sessions", () => {
      // Session 1: 225, Session 2: 360
      // Total: 585
      expect(calcTotalCalories(mockSessions)).toBe(585);
    });

    it("returns 0 for empty sessions", () => {
      expect(calcTotalCalories([])).toBe(0);
    });
  });

  describe("calcMuscleGroupSets", () => {
    it("counts sets per muscle group", () => {
      const counts = calcMuscleGroupSets(mockSessions);
      expect(counts.chest).toBe(2);
      expect(counts.legs).toBe(1);
      expect(counts.back).toBe(2);
      expect(counts.shoulders).toBe(0);
      expect(counts.arms).toBe(0);
      expect(counts.core).toBe(0);
    });

    it("returns zeros for empty sessions", () => {
      const counts = calcMuscleGroupSets([]);
      expect(counts.chest).toBe(0);
      expect(counts.back).toBe(0);
    });
  });

  describe("calcTypeDistribution", () => {
    it("counts sessions by training type", () => {
      const dist = calcTypeDistribution(mockSessions);
      expect(dist.bodybuilding).toBe(1);
      expect(dist.powerlifting).toBe(1);
      expect(dist.crossfit).toBe(0);
    });

    it("returns zeros for empty sessions", () => {
      const dist = calcTypeDistribution([]);
      expect(dist.bodybuilding).toBe(0);
      expect(dist.powerlifting).toBe(0);
      expect(dist.crossfit).toBe(0);
    });
  });

  describe("formatDuration", () => {
    it("formats minutes only", () => {
      expect(formatDuration(45)).toBe("45 min");
    });

    it("formats hours and minutes", () => {
      expect(formatDuration(75)).toBe("1h 15min");
    });

    it("formats hours only", () => {
      expect(formatDuration(120)).toBe("2h");
    });

    it("handles zero", () => {
      expect(formatDuration(0)).toBe("0 min");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with thousands separator", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(12450)).toBe("12,450");
    });

    it("handles small numbers", () => {
      expect(formatNumber(50)).toBe("50");
    });
  });

  describe("getLastSessions", () => {
    it("returns last N sessions sorted by date", () => {
      const last = getLastSessions(mockSessions, 1);
      expect(last.length).toBe(1);
      expect(last[0].id).toBe(2); // Most recent
    });

    it("returns all sessions if limit exceeds count", () => {
      const last = getLastSessions(mockSessions, 10);
      expect(last.length).toBe(2);
    });

    it("returns empty array for no sessions", () => {
      expect(getLastSessions([], 10)).toEqual([]);
    });
  });

  describe("getSessionDuration", () => {
    it("calculates session duration in minutes", () => {
      expect(getSessionDuration(mockSessions[0])).toBe(45);
      expect(getSessionDuration(mockSessions[1])).toBe(60);
    });

    it("returns 0 for invalid session", () => {
      expect(getSessionDuration({})).toBe(0);
    });
  });

  describe("getSessionVolume", () => {
    it("calculates total volume for a session", () => {
      expect(getSessionVolume(mockSessions[0])).toBe(2630);
      expect(getSessionVolume(mockSessions[1])).toBe(820);
    });

    it("returns 0 for session without exercises", () => {
      expect(getSessionVolume({ exercises: [] })).toBe(0);
    });
  });

  describe("formatChartDate", () => {
    it("formats date for chart display", () => {
      const formatted = formatChartDate("2024-01-10T10:00:00Z");
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("10");
    });
  });

  describe("getFavoriteType", () => {
    it("returns most common training type", () => {
      const sessions = [
        ...mockSessions,
        { ...mockSessions[0], id: 3 }, // Another bodybuilding
      ];
      expect(getFavoriteType(sessions)).toBe("Bodybuilding");
    });

    it("returns None for empty sessions", () => {
      expect(getFavoriteType([])).toBe("None");
    });
  });

  describe("getMemberSince", () => {
    it("returns date of first session", () => {
      const since = getMemberSince(mockSessions);
      expect(since).toContain("January");
      expect(since).toContain("10");
      expect(since).toContain("2024");
    });

    it("returns message for no sessions", () => {
      expect(getMemberSince([])).toBe("No sessions yet");
    });
  });
});
