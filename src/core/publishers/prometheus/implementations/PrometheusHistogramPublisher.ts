import MetricData from "../../../types/MetricData";
import { PrometheusPublisher } from "../abstracts/PrometheusPublisher";

import axios from "axios";
import { MetricDataStorageType } from "src/core/libs/storage/MetricDataStorage";

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

  async publish(items: MetricDataStorageType): Promise<void> {
    try {
      const payloadString = (
        await Promise.all(
          Object.values(items).map(async (metricGroup: MetricData[]) => {
            let subPayloadString = "";
            subPayloadString += await this.createHistogramPayloadForData(
              metricGroup
            );

            return subPayloadString;
          })
        )
      ).join("\n");

      await this.sendToPrometheus(payloadString);
    } catch (e) {
      throw e;
    }
  }

  private async createHistogramPayloadForData(metrics: MetricData[]) {
    /* TODO: Implement this function after Prometheus client library written.
    const localRegistry = new client.Registry();

    let histogramMetric = new client.Histogram({
      name: metrics[0].metric_name,
      help: this.help || "",
      labelNames: metrics[0].labels ? Object.keys(metrics[0].labels) : [],
      buckets: this.buckets,
      registers: [localRegistry],
    });

    metrics.forEach((metrics) => {
      if (typeof metrics.data === "number") {
        if (metrics.labels) {
          histogramMetric.observe(metrics.labels, metrics.data);
        } else {
          histogramMetric.observe(metrics.data);
        }
      }
    });

    return await localRegistry.metrics();
    */
    return [];
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
      console.log(payload);
      throw e;
    }
  }
}
