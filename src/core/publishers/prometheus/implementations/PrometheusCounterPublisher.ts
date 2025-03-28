import {
  MetricDataStorage,
  MetricDataStorageType,
} from "src/core/utils/storage/MetricDataStorage";
import { PrometheusPublisher } from "../abstracts/PrometheusPublisher";
import MetricData from "src/core/types/MetricData";
import axios from "axios";
import sendPayloadToPrometheus from "../utils/send-payload";

export class PrometheusCounterPublisher extends PrometheusPublisher {
  prometheus_url: string;
  help?: string;

  constructor(opts: { prometheus_url: string; help?: string }) {
    super();
    this.prometheus_url = opts.prometheus_url;
    this.help = opts.help;
  }

  public async publish(data: MetricData[]): Promise<void> {
    try {
      const storage = new MetricDataStorage();
      storage.add(data);
      const payload = this.createPayload(storage.getAll());
      await sendPayloadToPrometheus(this.prometheus_url, payload);
      console.log("✅ Data sent to Prometheus.");
      return Promise.resolve();
    } catch (e) {
      console.log("❌ Error sending data to Prometheus.\n", e);
      return Promise.reject(e);
    }
  }

  private createPayload(items: MetricDataStorageType): string {
    return Object.entries(items)
      .map(([metric_name, metricGroup]: [string, MetricData[]]) => {
        const typeString = `#TYPE ${metric_name} counter\n`;
        const helpString = `#HELP ${metric_name} ${
          this.help || "No help data."
        }\n`;

        const payloads = metricGroup.map((metric: MetricData) => {
          let labelString = "";
          if (metric.labels) {
            labelString = Object.entries(metric.labels)
              .map(([key, value]) => `${key}="${value}"`)
              .join(",");
          }

          return `${metric_name}{${labelString}} ${metric.data}\n`;
        });

        return helpString + typeString + payloads.join("\n");
      })
      .join("\n");
  }
}
