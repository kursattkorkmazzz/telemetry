import { AbstractMetricCollector } from "../abstracts/AbstractMetricCollector";
import MetricData from "../types/MetricData";

export class CounterMetricCollector extends AbstractMetricCollector {
  counter: number = 0;
  metric_name: string;
  labels?: Record<string, string>;

  constructor(opts: { metric_name: string; labels?: Record<string, string> }) {
    super();
    this.counter = 0;
    this.metric_name = opts.metric_name;
    this.labels = opts.labels;
  }

  collect(): Promise<MetricData | MetricData[]> {
    return new Promise((resolve, reject) => {
      resolve({
        metric_name: this.metric_name,
        labels: this.labels,
        data: this.counter,
      });
    });
  }

  increment(amount?: number) {
    this.counter += amount || 1;
  }
}
