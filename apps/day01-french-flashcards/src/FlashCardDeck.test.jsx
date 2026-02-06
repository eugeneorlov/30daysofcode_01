import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FlashCardDeck } from "./FlashCardDeck";

const cards = [
  { id: 1, french: "Bonjour", english: "Hello", example: "Bonjour !" },
  { id: 2, french: "Merci", english: "Thank you", example: "Merci beaucoup !" },
  { id: 3, french: "Oui", english: "Yes", example: "Oui, je comprends." },
];

describe("FlashCardDeck", () => {
  it("shows the first card initially", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("displays progress as 1 / 3", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("navigates to the next card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Merci")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates back to the previous card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("disables Previous button on first card", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables Next button on last card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("resets to the first card when Reset is clicked", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("shuffles the deck when Shuffle is clicked", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Shuffle"));
    // After shuffle, should reset to card 1 of 3
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
});
