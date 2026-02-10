import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("renders landing page at root", () => {
    render(<App />);
    expect(screen.getByTestId("get-started-btn")).toBeInTheDocument();
    expect(screen.getByText(/no-nonsense/i)).toBeInTheDocument();
  });

  it("opens sign-in modal when Get Started is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("get-started-btn"));
    expect(screen.getByTestId("signin-modal")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
  });

  it("signs in and navigates to session page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("get-started-btn"));

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Eugene" } });
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "30" } });
    fireEvent.click(screen.getByTestId("signin-submit"));

    expect(screen.getByText("Start a Session")).toBeInTheDocument();
  });

  it("shows validation error with empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("get-started-btn"));
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "25" } });
    fireEvent.click(screen.getByTestId("signin-submit"));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
  });

  it("shows validation error with invalid age", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("get-started-btn"));
    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test" } });
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "5" } });
    fireEvent.click(screen.getByTestId("signin-submit"));

    expect(screen.getByText(/valid age/)).toBeInTheDocument();
  });

  it("persists user across remount", () => {
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByTestId("get-started-btn"));
    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Eugene" } });
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "30" } });
    fireEvent.click(screen.getByTestId("signin-submit"));

    expect(screen.getByText("Start a Session")).toBeInTheDocument();
    unmount();

    render(<App />);
    expect(localStorage.getItem("ironlog-user")).not.toBeNull();
  });
});
