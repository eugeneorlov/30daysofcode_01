import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { Dashboard } from "./Dashboard";

vi.mock("../components/URLForm", () => ({
  URLForm: () => <div data-testid="url-form">URL Form</div>,
}));

vi.mock("../components/URLResult", () => ({
  URLResult: () => <div data-testid="url-result">URL Result</div>,
}));

vi.mock("../components/URLList", () => ({
  URLList: () => <div data-testid="url-list">URL List</div>,
}));

function renderWithRouter(component) {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
}

describe("Dashboard", () => {
  it("renders dashboard with main heading", () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/URL Shortener/i)).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByRole("button", { name: /Sign Out/i })).toBeInTheDocument();
  });

  it("renders all URL shortener components", () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByTestId("url-form")).toBeInTheDocument();
    expect(screen.getByTestId("url-result")).toBeInTheDocument();
    expect(screen.getByTestId("url-list")).toBeInTheDocument();
  });
});
