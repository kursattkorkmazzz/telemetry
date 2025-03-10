import { MetricDataStorageType } from "src/core/core/libs/storage/MetricDataStorage";
import { PrometheusPublisher } from "./core/PrometheusPublisher";
import MetricData from "src/core/core/types/MetricData";
import axios from "axios";

export class PrometheusCounterPublisher extends PrometheusPublisher {
  prometheus_url: string;
  help?: string;

  constructor(opts: { prometheus_url: string; help?: string }) {
    super();
    this.prometheus_url = opts.prometheus_url;
    this.help = opts.help;
  }

  public async publish(items: MetricDataStorageType): Promise<void> {
    try {
      const payload = this.createPayload(items);

      await this.sendRequest(payload);

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

  private async sendRequest(payload: string): Promise<void> {
    try {
      const response = await axios.post(this.prometheus_url, payload, {
        headers: {
          "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
          "User-Agent": "Prometheus/4.0",
          "Content-Encoding": "gzip",
        },
      });
      if (response.status == 202) {
        return;
      }
      throw new Error(
        `Failed to send data to Prometheus. Status: ${response.status}`
      );
    } catch (e) {
      throw e;
    }
  }
}
