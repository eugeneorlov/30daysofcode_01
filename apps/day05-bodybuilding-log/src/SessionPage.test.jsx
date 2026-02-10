import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { SessionPage } from "./SessionPage";
import { renderWithProviders } from "./test/renderWithProviders";

beforeEach(() => {
  localStorage.clear();
});

describe("SessionPage", () => {
  it("renders training type selector initially", () => {
    renderWithProviders(<SessionPage />);
    expect(screen.getByText("Start a Session")).toBeInTheDocument();
    expect(screen.getByTestId("type-bodybuilding")).toBeInTheDocument();
    expect(screen.getByTestId("type-powerlifting")).toBeInTheDocument();
    expect(screen.getByTestId("type-crossfit")).toBeInTheDocument();
  });

  it("starts a session when training type is selected", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    expect(screen.getByText("Bodybuilding Session")).toBeInTheDocument();
    expect(screen.getByTestId("session-timer")).toBeInTheDocument();
    expect(screen.getByTestId("finish-btn")).toBeInTheDocument();
  });

  it("opens add exercise modal", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("add-exercise-btn"));
    expect(screen.getByTestId("add-exercise-modal")).toBeInTheDocument();
  });

  it("adds an exercise from the modal", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("add-exercise-btn"));
    fireEvent.click(screen.getByText("Bench Press"));
    // Modal should close and exercise card should appear
    expect(screen.queryByTestId("add-exercise-modal")).not.toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });

  it("logs a set for an exercise", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("add-exercise-btn"));
    fireEvent.click(screen.getByText("Bench Press"));

    fireEvent.change(screen.getByTestId("weight-input-bench-press"), {
      target: { value: "135" },
    });
    fireEvent.change(screen.getByTestId("reps-input-bench-press"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText("Add Set"));

    expect(screen.getByText("135 lbs")).toBeInTheDocument();
    expect(screen.getByText("10 reps")).toBeInTheDocument();
  });

  it("finishes a session and returns to type selector", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("finish-btn"));
    expect(screen.getByText("Start a Session")).toBeInTheDocument();
  });

  it("saves session to localStorage when finishing with logged sets", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("add-exercise-btn"));
    fireEvent.click(screen.getByText("Bench Press"));

    fireEvent.change(screen.getByTestId("weight-input-bench-press"), {
      target: { value: "135" },
    });
    fireEvent.change(screen.getByTestId("reps-input-bench-press"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText("Add Set"));
    fireEvent.click(screen.getByTestId("finish-btn"));

    const sessions = JSON.parse(localStorage.getItem("ironlog-sessions"));
    expect(sessions).toHaveLength(1);
    expect(sessions[0].trainingType).toBe("Bodybuilding");
    expect(sessions[0].exercises[0].name).toBe("Bench Press");
  });

  it("removes an exercise", () => {
    renderWithProviders(<SessionPage />);
    fireEvent.click(screen.getByTestId("type-bodybuilding"));
    fireEvent.click(screen.getByTestId("add-exercise-btn"));
    fireEvent.click(screen.getByText("Bench Press"));
    expect(screen.getByText("Bench Press")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));
    // Bench Press text should not be visible as an exercise card
    expect(screen.queryByTestId("weight-input-bench-press")).not.toBeInTheDocument();
  });
});
