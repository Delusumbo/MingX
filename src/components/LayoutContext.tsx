import { createContext, useContext, useState, type ReactNode } from "react";

type LayoutContextType = {
	mobileMenuOpen: boolean;
	openMobileMenu: () => void;
	closeMobileMenu: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const openMobileMenu = () => setMobileMenuOpen(true);
	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<LayoutContext.Provider
			value={{
				mobileMenuOpen,
				openMobileMenu,
				closeMobileMenu,
			}}>
			{children}
		</LayoutContext.Provider>
	);
}

export function useLayout() {
	const context = useContext(LayoutContext);

	if (!context) {
		throw new Error("useLayout must be used inside LayoutProvider");
	}

	return context;
}
