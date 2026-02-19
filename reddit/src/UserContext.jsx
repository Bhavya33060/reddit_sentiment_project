import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    fullName: "P SRI HARSHITHA",
    username: "psriharshitha",
    email: "sriharshitha0106@gmail.com",
    bio: "AI & Data Enthusiast"
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}