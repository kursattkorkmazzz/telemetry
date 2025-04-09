import { AbstractPublisher } from "../abstracts/AbstractPublisher";
import MetricData from "../types/MetricData";

export class PrintConsolePublisher extends AbstractPublisher {
  override publish(data: MetricData | Array<MetricData>): Promise<void> {
    if (!Array.isArray(data)) {
      this.printMetricData(data);
      return Promise.resolve();
    }
    data.forEach((md) => this.printMetricData(md));
    return Promise.resolve();
  }

  private printMetricData(data: MetricData) {
    console.log("========================");
    console.log("Metric Name: " + data.metric_name);
    console.log("Metric Tags: " + JSON.stringify(data.tags, null, 3));
    console.log("Metric Fields: " + JSON.stringify(data.fields, null, 3));
    console.log("========================");
  }
}
