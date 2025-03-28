import { ComponentEventCollector } from "./collectors";
import { TelemetryProvider } from "./providers";
import PrometheusCounterPublisherComponent from "./publishers/prometheus/counter-publisher";

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
};

export default Telemetry;
