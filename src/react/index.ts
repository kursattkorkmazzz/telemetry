import { ComponentEventCollector } from "./collectors";
import { TelemetryProvider } from "./providers";
import PrometheusCounterPublisherComponent from "./publishers/prometheus/counter-publisher";
import { defineConfig } from "./utils/define-config";

const Telemetry = {
  Provider: TelemetryProvider,
  Publishers: {
    Prometheus: {
      Counter: PrometheusCounterPublisherComponent,
    },
  },
  Collectors: {
    ComponentEventCollector,
  },
  Config: {
    defineConfig,
  },
};

export default Telemetry;
