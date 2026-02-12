import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the landing page by default", () => {
    render(<App />);
    expect(screen.getByText(/Shorten Your Links/i)).toBeInTheDocument();
  });

  it("renders call-to-action buttons on landing page", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /Get Started Free/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("renders feature sections on landing page", () => {
    render(<App />);
    expect(screen.getByText(/Lightning Fast/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure & Reliable/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Performance/i)).toBeInTheDocument();
  });
});
