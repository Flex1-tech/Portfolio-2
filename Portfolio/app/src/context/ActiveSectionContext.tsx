import React, { createContext, useContext, useState, useCallback } from 'react';

interface ActiveSectionContextType {
 activeSection: string;
 setActiveSection: (id: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType>({
 activeSection: '',
 setActiveSection: () => {},
});

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
 const [activeSection, setActiveSection] = useState('');

 const handleSetActive = useCallback((id: string) => {
 setActiveSection(id);
 }, []);

 return (
 <ActiveSectionContext.Provider value={{ activeSection, setActiveSection: handleSetActive }}>
 {children}
 </ActiveSectionContext.Provider>
 );
}

export function useActiveSection() {
 return useContext(ActiveSectionContext);
}
