import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CompleteScreen } from "./CompleteScreen";

describe("CompleteScreen", () => {
  it("shows total rounds", () => {
    render(
      <CompleteScreen
        totalRounds={5}
        totalElapsed={900}
        onGoAgain={() => {}}
        onChangeMode={() => {}}
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Rounds")).toBeInTheDocument();
  });

  it("shows formatted total time", () => {
    render(
      <CompleteScreen
        totalRounds={5}
        totalElapsed={754}
        onGoAgain={() => {}}
        onChangeMode={() => {}}
      />
    );
    expect(screen.getByText("12:34")).toBeInTheDocument();
  });

  it("calls onGoAgain when Go Again is clicked", () => {
    const onGoAgain = vi.fn();
    render(
      <CompleteScreen
        totalRounds={5}
        totalElapsed={100}
        onGoAgain={onGoAgain}
        onChangeMode={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Go Again"));
    expect(onGoAgain).toHaveBeenCalledTimes(1);
  });

  it("calls onChangeMode when Change Mode is clicked", () => {
    const onChangeMode = vi.fn();
    render(
      <CompleteScreen
        totalRounds={5}
        totalElapsed={100}
        onGoAgain={() => {}}
        onChangeMode={onChangeMode}
      />
    );
    fireEvent.click(screen.getByText("Change Mode"));
    expect(onChangeMode).toHaveBeenCalledTimes(1);
  });
});
