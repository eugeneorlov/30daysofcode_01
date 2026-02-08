import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PresetSelector } from "./PresetSelector";

describe("PresetSelector", () => {
  it("renders all four preset cards", () => {
    render(<PresetSelector onStart={() => {}} />);
    expect(screen.getByText(/Muay Thai/)).toBeInTheDocument();
    expect(screen.getByText(/BJJ/)).toBeInTheDocument();
    expect(screen.getByText(/Tabata/)).toBeInTheDocument();
    expect(screen.getByText(/Custom/)).toBeInTheDocument();
  });

  it("calls onStart with Muay Thai config", () => {
    const onStart = vi.fn();
    render(<PresetSelector onStart={onStart} />);
    fireEvent.click(screen.getByText(/Muay Thai/));
    expect(onStart).toHaveBeenCalledWith({ roundSec: 180, restSec: 60, rounds: 5 });
  });

  it("calls onStart with BJJ config", () => {
    const onStart = vi.fn();
    render(<PresetSelector onStart={onStart} />);
    fireEvent.click(screen.getByText(/BJJ/));
    expect(onStart).toHaveBeenCalledWith({ roundSec: 300, restSec: 60, rounds: 3 });
  });

  it("calls onStart with Tabata config", () => {
    const onStart = vi.fn();
    render(<PresetSelector onStart={onStart} />);
    fireEvent.click(screen.getByText(/Tabata/));
    expect(onStart).toHaveBeenCalledWith({ roundSec: 20, restSec: 10, rounds: 8 });
  });

  it("shows custom form when Custom is clicked", () => {
    render(<PresetSelector onStart={() => {}} />);
    fireEvent.click(screen.getByText(/Custom/));
    expect(screen.getByText("Custom Setup")).toBeInTheDocument();
    expect(screen.getByTestId("custom-round-min")).toBeInTheDocument();
  });

  it("custom form calls onStart with correct config", () => {
    const onStart = vi.fn();
    render(<PresetSelector onStart={onStart} />);
    fireEvent.click(screen.getByText(/Custom/));

    fireEvent.change(screen.getByTestId("custom-round-min"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("custom-round-sec"), { target: { value: "30" } });
    fireEvent.change(screen.getByTestId("custom-rest-min"), { target: { value: "0" } });
    fireEvent.change(screen.getByTestId("custom-rest-sec"), { target: { value: "45" } });
    fireEvent.change(screen.getByTestId("custom-rounds"), { target: { value: "4" } });

    fireEvent.click(screen.getByText("Start"));
    expect(onStart).toHaveBeenCalledWith({ roundSec: 150, restSec: 45, rounds: 4 });
  });

  it("custom form disables Start when round time is zero", () => {
    render(<PresetSelector onStart={() => {}} />);
    fireEvent.click(screen.getByText(/Custom/));

    fireEvent.change(screen.getByTestId("custom-round-min"), { target: { value: "0" } });
    fireEvent.change(screen.getByTestId("custom-round-sec"), { target: { value: "0" } });

    expect(screen.getByText("Start")).toBeDisabled();
  });
});
