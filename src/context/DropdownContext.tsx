import React, { useState, useCallback } from 'react';
import { DropdownContext } from './DropdownContextDefinition';

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

