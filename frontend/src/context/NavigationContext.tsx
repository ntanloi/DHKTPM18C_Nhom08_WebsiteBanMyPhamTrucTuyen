import { createContext, useContext, type ReactNode } from 'react';

interface NavigationContextType {
  navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({
  children,
  navigate,
}: {
  children: ReactNode;
  navigate: (path: string) => void;
}) {
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
