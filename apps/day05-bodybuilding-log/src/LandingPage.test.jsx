import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LandingPage } from "./LandingPage";
import { renderWithProviders } from "./test/renderWithProviders";

describe("LandingPage", () => {
  it("renders hero with IronLog branding", () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("IronLog");
    expect(screen.getByText(/no-nonsense/i)).toBeInTheDocument();
  });

  it("renders feature cards", () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText("Track Sets & Reps")).toBeInTheDocument();
    expect(screen.getByText("Session Timer")).toBeInTheDocument();
    expect(screen.getByText("Progress Charts")).toBeInTheDocument();
  });

  it("shows Get Started button", () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByTestId("get-started-btn")).toBeInTheDocument();
  });

  it("opens sign-in modal on Get Started click", () => {
    renderWithProviders(<LandingPage />);
    fireEvent.click(screen.getByTestId("get-started-btn"));
    expect(screen.getByTestId("signin-modal")).toBeInTheDocument();
  });
});
