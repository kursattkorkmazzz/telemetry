import { useEffect } from "react";

export type ConfigType = {
  INFLUX_CONFIGS?: {
    URL: string;
    TOKEN: string;
    ORGANIZATION_ID: string;
    BUCKET_NAME: string;
    DEFAULT_TAGS?: Record<string, string>;
  };
};

export function defineConfig(config: ConfigType): void {
  if (!window) return;
  // Add all the config to the environment variables
  (window as any).TELEMETRY_AS = config;
}
