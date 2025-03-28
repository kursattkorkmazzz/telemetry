import MetricData from "../../../types/MetricData";
import { PrometheusPublisher } from "../abstracts/PrometheusPublisher";

import axios from "axios";
import { MetricDataStorageType } from "src/core/utils/storage/MetricDataStorage";

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
      return;
    } catch (e) {
      throw e;
    }
  }

  private async createHistogramPayloadForData(metrics: MetricData[]) {}
}
