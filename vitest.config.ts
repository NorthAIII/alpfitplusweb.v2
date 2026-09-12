import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Node ortami: testler route handler'lari ve saf fonksiyonlari dogrudan
// import eder, tarayici DOM'una ihtiyac yok. `@` takma adi ek bir eklenti
// (vite-tsconfig-paths) olmadan `resolve.alias` ile elle taninir — tsconfig.json
// ile ayni hedefi (`./src`) gosterir, iki kaynak elle senkron tutulur.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
