import React, { createContext, useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [authToken, setAuthToken] = useLocalStorage("authToken", null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        setAuthToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [authToken, setAuthToken]);

  const contextValue = {
    authToken,
    setAuthToken,
    user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
