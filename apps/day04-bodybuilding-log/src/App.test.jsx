import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("renders the header and today tab", () => {
    render(<App />);
    expect(screen.getByText("Bodybuilding Log")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  it("shows add exercise prompt initially", () => {
    render(<App />);
    expect(screen.getByText("+ Add Exercise")).toBeInTheDocument();
  });

  it("opens exercise selector when Add Exercise is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("+ Add Exercise"));
    expect(screen.getByText("Add Exercise")).toBeInTheDocument();
    expect(screen.getByTestId("exercise-search")).toBeInTheDocument();
  });

  it("adds an exercise and shows SetLogger", () => {
    render(<App />);
    fireEvent.click(screen.getByText("+ Add Exercise"));
    fireEvent.click(screen.getByText("Bench Press"));
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Chest")).toBeInTheDocument();
  });

  it("logs a set for an exercise", () => {
    render(<App />);
    fireEvent.click(screen.getByText("+ Add Exercise"));
    fireEvent.click(screen.getByText("Bench Press"));

    fireEvent.change(screen.getByTestId("weight-input-bench-press"), {
      target: { value: "135" },
    });
    fireEvent.change(screen.getByTestId("reps-input-bench-press"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText("Add Set"));

    expect(screen.getByText(/135 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/10 reps/)).toBeInTheDocument();
  });

  it("removes an exercise", () => {
    render(<App />);
    fireEvent.click(screen.getByText("+ Add Exercise"));
    fireEvent.click(screen.getByText("Bench Press"));
    expect(screen.getByText("Bench Press")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));
    expect(screen.getByText("+ Add Exercise")).toBeInTheDocument();
  });

  it("switches to History tab and shows empty state", () => {
    render(<App />);
    fireEvent.click(screen.getByText("History"));
    expect(screen.getByText("No workouts yet.")).toBeInTheDocument();
  });

  it("persists workout across remount", () => {
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByText("+ Add Exercise"));
    fireEvent.click(screen.getByText("Squat"));

    fireEvent.change(screen.getByTestId("weight-input-squat"), {
      target: { value: "225" },
    });
    fireEvent.change(screen.getByTestId("reps-input-squat"), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText("Add Set"));
    unmount();

    render(<App />);
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText(/225 lbs/)).toBeInTheDocument();
  });
});
