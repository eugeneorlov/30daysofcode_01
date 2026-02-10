import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfilePage } from "./ProfilePage";
import * as useUserModule from "./context/useUser";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockUpdateUser = vi.fn();
const mockClearAllData = vi.fn();

describe("ProfilePage", () => {
  const mockUser = {
    name: "John Doe",
    age: 25,
    avatar: "🏋️",
    defaultTrainingType: "bodybuilding",
  };

  const mockSessions = [
    {
      id: 1,
      trainingType: "bodybuilding",
      startedAt: "2024-01-10T10:00:00Z",
      endedAt: "2024-01-10T10:45:00Z",
      exercises: [],
    },
    {
      id: 2,
      trainingType: "powerlifting",
      startedAt: "2024-01-15T14:00:00Z",
      endedAt: "2024-01-15T15:00:00Z",
      exercises: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useUserModule, "useUser").mockReturnValue({
      user: mockUser,
      sessions: mockSessions,
      updateUser: mockUpdateUser,
      clearAllData: mockClearAllData,
    });
  });

  it("renders user profile information", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });

  it("renders stats summary", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Total Sessions")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Favorite Type")).toBeInTheDocument();
  });

  it("renders avatar picker with all options", () => {
    render(<ProfilePage />);

    // Should have 10 avatar options
    const avatarButtons = screen.getAllByRole("button").filter((btn) => {
      const text = btn.textContent;
      return ["🏋️", "💪", "🥊", "🏃", "🧘", "🦾", "🔥", "⚡", "🎯", "🏆"].includes(text);
    });

    expect(avatarButtons.length).toBe(10);
  });

  it("updates avatar immediately when selected", () => {
    render(<ProfilePage />);

    const newAvatarButton = screen.getByText("💪");
    fireEvent.click(newAvatarButton);

    expect(mockUpdateUser).toHaveBeenCalledWith({ avatar: "💪" });
  });

  it("renders training type selector", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Powerlifting")).toBeInTheDocument();
    expect(screen.getAllByText("Bodybuilding").length).toBeGreaterThan(0);
    expect(screen.getByText("Crossfit")).toBeInTheDocument();
  });

  it("updates profile when save button clicked", () => {
    render(<ProfilePage />);

    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });

    const saveButton = screen.getByText("Save Profile");
    fireEvent.click(saveButton);

    expect(mockUpdateUser).toHaveBeenCalledWith({
      name: "Jane Smith",
      age: 25,
      avatar: "🏋️",
      defaultTrainingType: "bodybuilding",
    });
  });

  it("renders danger zone", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    expect(screen.getByText("Clear All Data")).toBeInTheDocument();
  });

  it("shows confirmation before clearing data", () => {
    render(<ProfilePage />);

    const clearButton = screen.getByText("Clear All Data");
    fireEvent.click(clearButton);

    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
    expect(screen.getByText("Yes, Delete Everything")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("clears data when confirmed", () => {
    render(<ProfilePage />);

    // First click shows confirmation
    const clearButton = screen.getByText("Clear All Data");
    fireEvent.click(clearButton);

    // Second click confirms
    const confirmButton = screen.getByText("Yes, Delete Everything");
    fireEvent.click(confirmButton);

    expect(mockClearAllData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("cancels data clear when cancel clicked", () => {
    render(<ProfilePage />);

    const clearButton = screen.getByText("Clear All Data");
    fireEvent.click(clearButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockClearAllData).not.toHaveBeenCalled();
    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
  });

  it("allows valid age input", () => {
    // Mock alert
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ProfilePage />);

    // Change age to a valid value
    const ageInput = screen.getByDisplayValue("25");
    fireEvent.change(ageInput, { target: { value: 30 } });

    const saveButton = screen.getByText("Save Profile");
    fireEvent.click(saveButton);

    // Should update without any age validation errors
    expect(mockUpdateUser).toHaveBeenCalledWith({
      name: "John Doe",
      age: 30,
      avatar: "🏋️",
      defaultTrainingType: "bodybuilding",
    });

    alertSpy.mockRestore();
  });
});
