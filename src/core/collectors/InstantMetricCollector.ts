import MetricData from "../core/types/MetricData";
import { CounterMetricCollector } from "./CounterMetricCollector";

export class InstantMetricCollector extends CounterMetricCollector {
  constructor(opts: { metric_name: string; labels?: Record<string, string> }) {
    super(opts);
    this.counter = 0;
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
  set(data: number) {
    this.counter = data;
  }
  get(): number {
    return this.counter;
  }
}
