import React, { createContext, useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { jwtDecode } from "jwt-decode"; // We will try the simplest import first.

// 1. Create the context and export it
export const UserContext = createContext();

// 2. Create the provider component and make it the default export
export default function UserProvider({ children }) {
  const [authToken, setAuthToken] = useLocalStorage("authToken", null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      try {
        // Use the jwtDecode function directly
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
  }, [authToken, setAuthToken]); // Removed setUser from dependency array

  const contextValue = {
    authToken,
    setAuthToken,
    user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
