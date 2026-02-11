import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { URLForm } from "./URLForm";

describe("URLForm", () => {
  it("renders the form with input and button", () => {
    render(<URLForm onURLShortened={() => {}} />);
    expect(screen.getByLabelText(/enter url to shorten/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /shorten/i })).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    render(<URLForm onURLShortened={() => {}} />);

    const input = screen.getByLabelText(/enter url to shorten/i);
    const button = screen.getByRole("button", { name: /shorten/i });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it("calls onURLShortened when form is submitted successfully", async () => {
    const mockOnURLShortened = vi.fn();
    const mockResponse = {
      short_code: "abc123",
      original_url: "https://example.com",
      short_url: "/abc123",
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(<URLForm onURLShortened={mockOnURLShortened} />);

    const input = screen.getByLabelText(/enter url to shorten/i);
    const button = screen.getByRole("button", { name: /shorten/i });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnURLShortened).toHaveBeenCalledWith(mockResponse);
    });
  });
});
