import { createContext, useContext, useState, ReactNode } from "react";

interface RegistrationContextType {
  isOpen: boolean;
  openRegistration: () => void;
  closeRegistration: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openRegistration = () => setIsOpen(true);
  const closeRegistration = () => setIsOpen(false);

  return (
    <RegistrationContext.Provider value={{ isOpen, openRegistration, closeRegistration }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
}
