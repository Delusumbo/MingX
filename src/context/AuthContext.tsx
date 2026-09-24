import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
	[key: string]: unknown; // replace with your actual user shape
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

	const login = (user: User, token: string) => {
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
		setUser(user);
		setToken(token);
	};

	const logout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		setUser(null);
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
