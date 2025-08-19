import React, { createContext, useState, useCallback } from 'react';

interface DropdownContextType {
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  isDropdownActive: (id: string) => boolean;
  closeAllDropdowns: () => void;
}

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdownState] = useState<string | null>(null);

  const setActiveDropdown = useCallback((id: string | null) => {
    setActiveDropdownState(id);
  }, []);

  const isDropdownActive = useCallback((id: string) => {
    return activeDropdown === id;
  }, [activeDropdown]);

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdownState(null);
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        activeDropdown,
        setActiveDropdown,
        isDropdownActive,
        closeAllDropdowns,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

