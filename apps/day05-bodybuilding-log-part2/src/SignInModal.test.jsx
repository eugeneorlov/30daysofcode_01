import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignInModal } from "./SignInModal";
import { renderWithProviders } from "./test/renderWithProviders";

describe("SignInModal", () => {
  it("renders form fields", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("age-input")).toBeInTheDocument();
    expect(screen.getByText("Pick an Avatar")).toBeInTheDocument();
  });

  it("renders avatar picker with emoji options", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    expect(screen.getByTestId("avatar-💪")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-🔥")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-🦍")).toBeInTheDocument();
  });

  it("shows error when submitting empty name", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "25" } });
    fireEvent.click(screen.getByTestId("signin-submit"));
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
  });

  it("shows error when age is below 13", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test" } });
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "10" } });
    fireEvent.click(screen.getByTestId("signin-submit"));
    expect(screen.getByText(/valid age/)).toBeInTheDocument();
  });

  it("shows error when age is above 120", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test" } });
    fireEvent.change(screen.getByTestId("age-input"), { target: { value: "150" } });
    fireEvent.click(screen.getByTestId("signin-submit"));
    expect(screen.getByText(/valid age/)).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<SignInModal onClose={onClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("allows selecting a different avatar", () => {
    renderWithProviders(<SignInModal onClose={() => {}} />);
    const fireAvatar = screen.getByTestId("avatar-🔥");
    fireEvent.click(fireAvatar);
    expect(fireAvatar.className).toContain("ring-amber-500");
  });
});
