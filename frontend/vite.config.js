// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Ensure the directory path is correctly pointing to where your .env files are located
  const env = loadEnv(mode, process.cwd(), "VITE_");

  console.log("Environment Variables Loaded:", env);

  return {
    // Your Vite configuration here
    plugins: [react()],
    base: env.VITE_BASE_URL || "http://localhost:8080",
    server: {
      // Server specific configs
    },
    build: {
      // Build specific configs
    },
  };
});
