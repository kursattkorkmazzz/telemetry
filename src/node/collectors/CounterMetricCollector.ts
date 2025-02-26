import AbstractMetricCollector from "@src/node/core/abstracts/AbstractMetricCollector";
import MetricData from "@src/node/core/types/MetricData";

export class CounterMetricCollector extends AbstractMetricCollector {
  counter: number = 0;
  name: string = "";
  constructor(collector_name?: string) {
    super();
    this.counter = 0;
    this.name = collector_name || "";
  }

  collect(): Promise<MetricData | MetricData[]> {
    return new Promise((resolve, reject) => {
      resolve({
        data: this.counter,
        timestamp: Date.now(),
        name: this.name,
      });
    });
  }

  increment(amount?: number) {
    this.counter += amount || 1;
  }

  decrement(amount?: number) {
    this.counter -= amount || 1;
  }
}
