import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { FlashCardDeck } from "./FlashCardDeck";

const cards = [
  { id: 1, french: "Bonjour", english: "Hello", example: "Bonjour !", category: "greetings" },
  { id: 2, french: "Merci", english: "Thank you", example: "Merci !", category: "greetings" },
  { id: 3, french: "Oui", english: "Yes", example: "Oui.", category: "essentials" },
  { id: 4, french: "Manger", english: "To eat", example: "Manger.", category: "cafe" },
];

beforeEach(() => {
  localStorage.clear();
});

describe("FlashCardDeck", () => {
  it("shows the first card initially", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("displays progress as 1 / 4", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
  });

  it("navigates to the next card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Merci")).toBeInTheDocument();
    expect(screen.getByText("2 / 4")).toBeInTheDocument();
  });

  it("navigates back to the previous card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
  });

  it("disables Previous button on first card", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables Next button on last card", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
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
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
  });

  it("shuffles the deck when Shuffle is clicked", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Shuffle"));
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
  });
});

describe("FlashCardDeck — category filtering", () => {
  it("renders category filter buttons", () => {
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Greetings")).toBeInTheDocument();
    expect(screen.getByText("Essentials")).toBeInTheDocument();
    expect(screen.getByText("Café")).toBeInTheDocument();
  });

  it("filters to only greetings cards when Greetings is clicked", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Greetings"));
    // Should show 2 greetings cards
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });

  it("shows correct card when filtering to a single-card category", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Essentials"));
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(screen.getByText("Oui")).toBeInTheDocument();
  });

  it("resets progress when category changes", () => {
    render(<FlashCardDeck cards={cards} />);
    // Navigate to second card in "All"
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("2 / 4")).toBeInTheDocument();
    // Switch category — should reset to 1
    fireEvent.click(screen.getByText("Greetings"));
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("returns to full deck when All is clicked after filtering", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Essentials"));
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
  });
});

describe("FlashCardDeck — localStorage persistence", () => {
  it("persists currentIndex to localStorage", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    expect(localStorage.getItem("flashcards-currentIndex")).toBe("1");
  });

  it("persists selectedCategory to localStorage", () => {
    render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Greetings"));
    expect(localStorage.getItem("flashcards-selectedCategory")).toBe("greetings");
  });

  it("restores category selection across remount", () => {
    const { unmount } = render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Essentials"));
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    unmount();

    // Remount — should restore "essentials" category
    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(screen.getByText("Oui")).toBeInTheDocument();
  });

  it("restores currentIndex across remount", () => {
    const { unmount } = render(<FlashCardDeck cards={cards} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("3 / 4")).toBeInTheDocument();
    unmount();

    render(<FlashCardDeck cards={cards} />);
    expect(screen.getByText("3 / 4")).toBeInTheDocument();
    expect(screen.getByText("Oui")).toBeInTheDocument();
  });
});
