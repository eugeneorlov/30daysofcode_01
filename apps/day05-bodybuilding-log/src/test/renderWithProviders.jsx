import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";

export function renderWithProviders(ui, { route = "/", ...options } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <UserProvider>{ui}</UserProvider>
    </MemoryRouter>,
    options
  );
}
