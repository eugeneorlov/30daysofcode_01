import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";

export function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <UserProvider>{ui}</UserProvider>
    </BrowserRouter>
  );
}
