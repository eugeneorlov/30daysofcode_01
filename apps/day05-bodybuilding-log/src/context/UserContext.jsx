import { useState } from "react";
import { load, save, remove } from "../storage";
import { UserContext } from "./userContextValue";

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => load("user", null));

  function signIn(userData) {
    save("user", userData);
    setUser(userData);
  }

  function signOut() {
    remove("user");
    setUser(null);
  }

  return <UserContext.Provider value={{ user, signIn, signOut }}>{children}</UserContext.Provider>;
}
