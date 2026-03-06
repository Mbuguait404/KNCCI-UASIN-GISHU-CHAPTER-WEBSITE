import { createContext, useContext, useState, ReactNode } from "react";

interface MembershipContextType {
    isOpen: boolean;
    openMembership: () => void;
    closeMembership: () => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openMembership = () => setIsOpen(true);
    const closeMembership = () => setIsOpen(false);

    return (
        <MembershipContext.Provider value={{ isOpen, openMembership, closeMembership }}>
            {children}
        </MembershipContext.Provider>
    );
}

export function useMembership() {
    const context = useContext(MembershipContext);
    if (context === undefined) {
        throw new Error("useMembership must be used within a MembershipProvider");
    }
    return context;
}
