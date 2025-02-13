import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    permissions: ["notifications", "storage", "tabs", "alarms", "commands"],
  },
  modules: ["@wxt-dev/module-react"],
});
