import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			"/verification-api": {
				target: "https://app.mingxdating.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/backend/public/api"),
			},
			"/mingxlive-api": {
				target: "https://mingxlive.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/mingxlive-api/, "/backend/public/api"),
			},
			"/api": {
				target: "https://app.mingxdating.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/backend/public/api"),
			},
		},
	},
});
 