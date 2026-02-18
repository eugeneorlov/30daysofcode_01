import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TechniqueCard } from "./TechniqueCard";

const mockTechnique = {
  id: 1,
  name: "Armbar from Guard",
  position: "Guard",
  type: "Submission",
  difficulty: "Beginner",
  description: "A fundamental armbar. Applied from the guard position.",
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <TechniqueCard technique={mockTechnique} {...props} />
    </MemoryRouter>,
  );
}

describe("TechniqueCard", () => {
  it("displays the technique name", () => {
    renderCard();
    expect(screen.getByText("Armbar from Guard")).toBeInTheDocument();
  });

  it("displays position badge", () => {
    renderCard();
    expect(screen.getByText("Guard")).toBeInTheDocument();
  });

  it("displays type badge", () => {
    renderCard();
    expect(screen.getByText("Submission")).toBeInTheDocument();
  });

  it("displays difficulty badge", () => {
    renderCard();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("shows first sentence of description in non-compact mode", () => {
    renderCard({ compact: false });
    expect(screen.getByText("A fundamental armbar.")).toBeInTheDocument();
  });

  it("hides description in compact mode", () => {
    renderCard({ compact: true });
    expect(screen.queryByText("A fundamental armbar.")).not.toBeInTheDocument();
  });

  it("is rendered as an article element", () => {
    renderCard();
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
