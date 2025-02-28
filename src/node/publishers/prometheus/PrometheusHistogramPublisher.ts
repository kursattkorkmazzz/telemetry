import MetricData from "../../core/types/MetricData";
import { PrometheusPublisher } from "./core/PrometheusPublisher";
import client from "prom-client";
import axios from "axios";
import GroupMetricsByName from "@src/node/core/utils/metric_data/GroupMetricsByName";

export class PrometheusHistogramPublisher extends PrometheusPublisher {
  prometheus_url: string;
  help?: string;
  buckets: number[];

  constructor(opts: {
    prometheus_url: string;
    help?: string;
    buckets: number[];
  }) {
    super();
    this.prometheus_url = opts.prometheus_url;
    this.help = opts.help;
    this.buckets = opts.buckets;
  }

  async publish(items: MetricData[]): Promise<void> {
    try {
      const grouped_metrics: MetricData[][] = GroupMetricsByName(items);

      const payloadArray = await Promise.all(
        grouped_metrics.map(
          async (group: MetricData[]) =>
            await this.createHistogramPayloadForData(group)
        )
      );

      const metricPayload = payloadArray.join("\n");

      await this.sendToPrometheus(metricPayload);
    } catch (e) {
      throw e;
    }
  }

  private async createHistogramPayloadForData(data: MetricData[]) {
    const localRegistry = new client.Registry();

    let histogramMetric = new client.Histogram({
      name: data[0].metric_name,
      help: this.help || "",
      labelNames: data[0].labels ? Object.keys(data[0].labels) : [],
      buckets: this.buckets,
      registers: [localRegistry],
    });

    data.forEach((data) => {
      if (typeof data.data === "number") {
        if (data.labels) {
          histogramMetric.observe(data.labels, data.data);
        } else {
          histogramMetric.observe(data.data);
        }
      }
    });

    return await localRegistry.metrics();
  }

  public async sendToPrometheus(payload: string) {
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
