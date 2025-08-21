import { createContext } from 'react';

interface DropdownContextType {
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  isDropdownActive: (id: string) => boolean;
  closeAllDropdowns: () => void;
}

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);