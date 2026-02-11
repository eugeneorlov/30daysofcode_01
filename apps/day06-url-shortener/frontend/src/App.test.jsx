import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the main heading", () => {
    render(<App />);
    expect(screen.getByText("🔗 URL Shortener")).toBeInTheDocument();
  });

  it("renders the URL form", () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/https:\/\/example\.com/)).toBeInTheDocument();
  });

  it("renders the shorten button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /shorten/i })).toBeInTheDocument();
  });
});
