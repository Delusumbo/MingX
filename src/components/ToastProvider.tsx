import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastType = "success" | "error";
type ToastMessage = { id: number; message: string; type: ToastType };
type ToastContextValue = {
	showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<ToastMessage | null>(null);

	const showToast = useCallback((message: string, type: ToastType = "success") => {
		setToast({ id: Date.now(), message, type });
	}, []);

	useEffect(() => {
		if (!toast) return;
		const timeout = window.setTimeout(() => setToast(null), 4000);
		return () => window.clearTimeout(timeout);
	}, [toast]);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{toast && (
				<div
					role={toast.type === "error" ? "alert" : "status"}
					className={`fixed right-4 top-4 z-200 flex max-w-sm items-start gap-4 rounded-xl px-5 py-4 text-sm text-white shadow-lg ${
						toast.type === "error" ? "bg-red-600" : "bg-green-700"
					}`}>
					<p className="flex-1">{toast.message}</p>
					<button
						type="button"
						onClick={() => setToast(null)}
						aria-label="Dismiss notification"
						className="font-bold leading-none text-white/80 hover:text-white">
						×
					</button>
				</div>
			)}
		</ToastContext.Provider>
	);
}

export function useToast(): ToastContextValue {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider.");
	}
	return context;
}
