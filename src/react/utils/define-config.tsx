import { useEffect } from "react";

type ConfigType = {
  INFLUX_URL: string;
  INFLUX_TOKEN: string;
  INFLUX_ORGANIZATION_ID: string;
  INFLUX_BUCKET: string;
};

export function defineConfig(config: ConfigType): void {
  useEffect(() => {
    if (!window) return;
    // Add all the config to the environment variables
    (window as any).TELEMETRY_AS = config;
  }, [window]);
}
