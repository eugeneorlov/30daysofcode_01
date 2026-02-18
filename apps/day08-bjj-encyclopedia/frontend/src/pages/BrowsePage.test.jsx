import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, afterEach } from "vitest";
import BrowsePage from "./BrowsePage";

const MOCK_TECHNIQUES = [
  {
    id: 1,
    name: "Armbar from Guard",
    position: "Guard",
    type: "Submission",
    difficulty: "Beginner",
    description: "A fundamental armbar from the guard.",
  },
  {
    id: 2,
    name: "Triangle Choke",
    position: "Guard",
    type: "Submission",
    difficulty: "Intermediate",
    description: "A blood choke using the legs.",
  },
  {
    id: 3,
    name: "Double Leg Takedown",
    position: "Standing",
    type: "Transition",
    difficulty: "Beginner",
    description: "A wrestling-based takedown.",
  },
];

function renderBrowse() {
  return render(
    <MemoryRouter>
      <BrowsePage />
    </MemoryRouter>,
  );
}

describe("BrowsePage", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(MOCK_TECHNIQUES),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    renderBrowse();
    expect(screen.getByText(/loading techniques/i)).toBeInTheDocument();
  });

  it("renders all technique cards after fetch", async () => {
    renderBrowse();
    await waitFor(() => {
      expect(screen.getByText("Armbar from Guard")).toBeInTheDocument();
    });
    expect(screen.getByText("Triangle Choke")).toBeInTheDocument();
    expect(screen.getByText("Double Leg Takedown")).toBeInTheDocument();
  });

  it("shows technique count", async () => {
    renderBrowse();
    await waitFor(() => {
      expect(screen.getByText(/showing 3 of 3/i)).toBeInTheDocument();
    });
  });

  it("shows error state when fetch fails", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
    renderBrowse();
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it("renders the page heading", async () => {
    renderBrowse();
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /BJJ Technique Encyclopedia/i })).toBeInTheDocument();
    });
  });
});
