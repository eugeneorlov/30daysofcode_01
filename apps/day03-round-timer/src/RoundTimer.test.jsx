import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RoundTimer } from "./RoundTimer";

// Mock the audio module so tests don't try to create AudioContext in jsdom
vi.mock("./audio", () => ({
  playWarningBeep: vi.fn(),
  playPhaseEndBeep: vi.fn(),
  playCompleteBeep: vi.fn(),
}));

describe("RoundTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts on the preset selector screen", () => {
    render(<RoundTimer />);
    expect(screen.getByText("Round Timer")).toBeInTheDocument();
  });

  it("selects Tabata preset and shows timer", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));
    expect(screen.getByText("WORK")).toBeInTheDocument();
    expect(screen.getByText("00:20")).toBeInTheDocument();
    expect(screen.getByText("Round 1 of 8")).toBeInTheDocument();
  });

  it("timer decrements each second", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));
    expect(screen.getByText("00:20")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("00:19")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("00:17")).toBeInTheDocument();
  });

  it("pause stops countdown, resume continues", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("00:17")).toBeInTheDocument();

    // Pause
    fireEvent.click(screen.getByText("Pause"));
    act(() => vi.advanceTimersByTime(5000));
    // Timer should not have changed
    expect(screen.getByText("00:17")).toBeInTheDocument();

    // Resume
    fireEvent.click(screen.getByText("Resume"));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("00:15")).toBeInTheDocument();
  });

  it("transitions from work to rest when time hits 0", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    // Advance through full 20-second work phase
    act(() => vi.advanceTimersByTime(20000));

    // Should now be in rest phase
    expect(screen.getByText("REST")).toBeInTheDocument();
    expect(screen.getByText("00:10")).toBeInTheDocument();
    expect(screen.getByText("Round 1 of 8")).toBeInTheDocument();
  });

  it("transitions from rest to next round", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    // Work phase (20s) + rest phase (10s) = 30s
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText("REST")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(10000));
    // Should be round 2, work phase
    expect(screen.getByText("WORK")).toBeInTheDocument();
    expect(screen.getByText("00:20")).toBeInTheDocument();
    expect(screen.getByText("Round 2 of 8")).toBeInTheDocument();
  });

  it("shows complete screen after final round", () => {
    render(<RoundTimer />);
    // Use Tabata: 20s work, 10s rest, 8 rounds
    // Advance per-phase so React effects handle transitions between phases.
    fireEvent.click(screen.getByText(/Tabata/));

    // 7 complete cycles: work (20s) then rest (10s) each
    for (let i = 0; i < 7; i++) {
      act(() => vi.advanceTimersByTime(20000)); // work phase
      act(() => vi.advanceTimersByTime(10000)); // rest phase
    }
    expect(screen.getByText("Round 8 of 8")).toBeInTheDocument();

    // Final work phase — no rest after the last round
    act(() => vi.advanceTimersByTime(20000));

    expect(screen.getByText("Done!")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Rounds")).toBeInTheDocument();
  });

  it("reset returns to initial config", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("00:15")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("00:20")).toBeInTheDocument();
    expect(screen.getByText("Round 1 of 8")).toBeInTheDocument();
  });

  it("back button returns to preset selector", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));
    expect(screen.getByText("WORK")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back/));
    expect(screen.getByText("Round Timer")).toBeInTheDocument();
  });

  it("Go Again restarts same workout from complete screen", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    // Fast-forward to completion (per-phase advances)
    for (let i = 0; i < 7; i++) {
      act(() => vi.advanceTimersByTime(20000));
      act(() => vi.advanceTimersByTime(10000));
    }
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText("Done!")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Go Again"));
    expect(screen.getByText("WORK")).toBeInTheDocument();
    expect(screen.getByText("00:20")).toBeInTheDocument();
    expect(screen.getByText("Round 1 of 8")).toBeInTheDocument();
  });

  it("Change Mode returns to preset selector from complete screen", () => {
    render(<RoundTimer />);
    fireEvent.click(screen.getByText(/Tabata/));

    for (let i = 0; i < 7; i++) {
      act(() => vi.advanceTimersByTime(20000));
      act(() => vi.advanceTimersByTime(10000));
    }
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText("Done!")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Change Mode"));
    expect(screen.getByText("Round Timer")).toBeInTheDocument();
  });
});
