"use client";

import { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

interface ContextProviderValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext({} as ContextProviderValue);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
