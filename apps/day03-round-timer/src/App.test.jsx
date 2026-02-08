import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the preset selector by default", () => {
    render(<App />);
    expect(screen.getByText("Round Timer")).toBeInTheDocument();
    expect(screen.getByText(/Muay Thai/)).toBeInTheDocument();
  });
});
