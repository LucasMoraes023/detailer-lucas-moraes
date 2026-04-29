import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.detailerlucasmoraes.app",
  appName: "Detailer Lucas Moraes",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#0a0a0a",
  },
};

export default config;
