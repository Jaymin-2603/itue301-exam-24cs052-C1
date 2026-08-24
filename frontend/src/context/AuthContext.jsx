// AuthContext.jsx
// Global auth state using React Context.
// Holds: member, token, role
// Provides: login() and logout() functions

import { createContext, useState } from "react";

// Create the context — exported so any component can import and consume it
export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // login() is called after a successful API login
  function login(memberData, tokenData, roleData) {
    setMember(memberData);
    setToken(tokenData);
    setRole(roleData);
  }

  // logout() clears all auth state
  function logout() {
    setMember(null);
    setToken(null);
    setRole(null);
  }

  // Pass the entire context value as one object
  const value = { member, token, role, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
