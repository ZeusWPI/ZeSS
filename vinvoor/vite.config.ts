import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

function generateRandomVersion() {
  const minor = Math.floor(Math.random() * 10);
  const patch = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `1.${minor}.${patch}`;
}

const appVersion = generateRandomVersion();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
});
