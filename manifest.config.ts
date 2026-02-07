import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

const matches = ["https://*.hh.ru/*"];

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: { 48: "public/logo.png" },
  action: {
    default_icon: { 48: "public/logo.png" },
    default_popup: "src/popup/index.html",
  },
  content_scripts: [
    {
      js: ["src/content/main.ts"],
      matches,
      run_at: "document_start",
    },
  ],
  web_accessible_resources: [
    {
      resources: ["src/content/index.html", "src/content/style.css"],
      matches,
    },
  ],
  permissions: ["contentSettings", "storage"],
});
