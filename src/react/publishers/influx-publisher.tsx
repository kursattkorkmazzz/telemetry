"use client";
import React, { useEffect } from "react";
import { InfluxPublisher } from "src/core";
import { useTelemetry } from "../providers";
import { ConfigType } from "../utils/define-config";
export function InfluxPublisherComponent() {
  const publisherId = "influx_publisher";
  const telemetryContext = useTelemetry();

  // Checks configuration is defined.
  useEffect(() => {
    if (window) {
      const config = (window as any).TELEMETRY_AS as ConfigType;
      if (config.INFLUX_CONFIGS) {
        const influxPublisher = new InfluxPublisher({
          organization_id: config.INFLUX_CONFIGS.ORGANIZATION_ID,
          bucket: config.INFLUX_CONFIGS.BUCKET_NAME,
          token: config.INFLUX_CONFIGS.TOKEN,
          url: config.INFLUX_CONFIGS.URL,
          defaultTags: config.INFLUX_CONFIGS.DEFAULT_TAGS,
        });

        telemetryContext.registerPublisher(influxPublisher, publisherId);
        return () => {
          telemetryContext.unregisterPublisher(publisherId);
        };
      } else {
        console.warn(
          "To initialize influx publisher, you have to set influx configs at defineConfig method."
        );
      }
    }
  }, []);
  return <></>;
}
