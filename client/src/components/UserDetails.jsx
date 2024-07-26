import { createContext, useState } from "react";

export const UserDetails = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  return (
    <UserDetails.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserDetails.Provider>
  );
}
