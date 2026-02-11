import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { URLResult } from "./URLResult";

describe("URLResult", () => {
  it("renders nothing when no result is provided", () => {
    const { container } = render(<URLResult result={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("displays the shortened URL and original URL", () => {
    const result = {
      short_code: "abc123",
      original_url: "https://example.com/very/long/url",
      short_url: "/abc123",
    };

    render(<URLResult result={result} />);

    expect(screen.getByText(/url shortened successfully/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://localhost:8000/abc123")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/very/long/url")).toBeInTheDocument();
  });

  it("copies URL to clipboard when copy button is clicked", async () => {
    const result = {
      short_code: "abc123",
      original_url: "https://example.com",
      short_url: "/abc123",
    };

    const mockClipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<URLResult result={result} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith("http://localhost:8000/abc123");
  });
});
