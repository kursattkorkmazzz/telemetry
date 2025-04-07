import { ComponentScreenTimeMetricCollector } from "./collectors";
import { TelemetryProvider } from "./providers";
import { InfluxPublisherComponent } from "./publishers";
import { defineConfig } from "./utils/define-config";

const Telemetry = {
  Provider: TelemetryProvider,
  Publishers: {
    InfluxPublisher: InfluxPublisherComponent,
  },
  Collectors: {
    ComponentScreenTimeCollector: ComponentScreenTimeMetricCollector,
  },
  Config: {
    defineConfig,
  },
};

export default Telemetry;
