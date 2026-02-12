import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { SignIn } from "./SignIn";

function renderWithRouter(component) {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
}

describe("SignIn", () => {
  it("renders sign in form", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("displays error when fields are empty", async () => {
    renderWithRouter(<SignIn />);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
    });
  });

  it("has link to sign up page", () => {
    renderWithRouter(<SignIn />);
    const signUpLink = screen.getByRole("link", { name: /Sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });

  it("has link back to home", () => {
    renderWithRouter(<SignIn />);
    const homeLink = screen.getByRole("link", { name: /Back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
