import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { LandingPage } from "./LandingPage";

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe("LandingPage", () => {
  it("renders main heading", () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/Shorten Your Links/i)).toBeInTheDocument();
  });

  it("renders call-to-action buttons", () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByRole("link", { name: /Get Started Free/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("renders feature sections", () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/Lightning Fast/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure & Reliable/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Performance/i)).toBeInTheDocument();
  });

  it("renders stats section", () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText("Links Shortened")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();
  });
});
