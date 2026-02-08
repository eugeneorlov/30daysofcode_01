import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimerDisplay } from "./TimerDisplay";

describe("TimerDisplay", () => {
  it("displays time in MM:SS format", () => {
    render(<TimerDisplay timeLeft={125} isResting={false} />);
    expect(screen.getByText("02:05")).toBeInTheDocument();
  });

  it("shows WORK label during work phase", () => {
    render(<TimerDisplay timeLeft={60} isResting={false} />);
    expect(screen.getByText("WORK")).toBeInTheDocument();
  });

  it("shows REST label during rest phase", () => {
    render(<TimerDisplay timeLeft={30} isResting={true} />);
    expect(screen.getByText("REST")).toBeInTheDocument();
  });

  it("pads single digits with zero", () => {
    render(<TimerDisplay timeLeft={5} isResting={false} />);
    expect(screen.getByText("00:05")).toBeInTheDocument();
  });
});
