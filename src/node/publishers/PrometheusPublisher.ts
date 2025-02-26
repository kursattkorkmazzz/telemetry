import AbstractPublisher from "../core/abstracts/AbstractPublisher";
import MetricData from "../core/types/MetricData";

export class PrometheusPublisher extends AbstractPublisher {
  name: string;

  constructor(opts: { name: string }) {
    super();
    this.name = opts.name;
  }

  publish(items: MetricData[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
