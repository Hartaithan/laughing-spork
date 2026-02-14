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
    default_popup: "src/main/popup.html",
  },
  content_scripts: [
    {
      js: ["src/main/index.ts"],
      matches,
      run_at: "document_start",
    },
  ],
  permissions: ["contentSettings", "storage"],
});
