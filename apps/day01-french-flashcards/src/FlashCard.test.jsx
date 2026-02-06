import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FlashCard } from "./FlashCard";

const mockCard = {
  id: 1,
  french: "Bonjour",
  english: "Hello",
  example: "Bonjour, comment allez-vous ?",
};

describe("FlashCard", () => {
  it("displays the French word on the front", () => {
    render(<FlashCard card={mockCard} flipped={false} onFlip={() => {}} />);
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("displays the English translation on the back", () => {
    render(<FlashCard card={mockCard} flipped={true} onFlip={() => {}} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("displays the example sentence when flipped", () => {
    render(<FlashCard card={mockCard} flipped={true} onFlip={() => {}} />);
    expect(screen.getByText(/Bonjour, comment allez-vous/)).toBeInTheDocument();
  });

  it("calls onFlip when clicked", () => {
    const onFlip = vi.fn();
    render(<FlashCard card={mockCard} flipped={false} onFlip={onFlip} />);
    fireEvent.click(screen.getByText("Bonjour"));
    expect(onFlip).toHaveBeenCalledTimes(1);
  });
});
