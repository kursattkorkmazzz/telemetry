import { AbstractPublisher } from "@src/node/core/abstracts/AbstractPublisher.js";
import MetricData from "@src/node/core/types/MetricData.js";

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
    console.log("Metric Labels: " + JSON.stringify(data.labels));
    console.log("Data: " + data.data);
    console.log("========================");
  }
}
