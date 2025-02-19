import AbstractPublisher from "src/core/abstracts/AbstractPublisher.js";
import MetricData from "src/core/types/MetricData.js";

export default class PrintConsolePublisher extends AbstractPublisher {
  override name: string = "Consoler Printer";
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
    console.log("Name: " + data.name);
    console.log("Timestamps: " + data.timestamp);
    console.log("Data: " + data.data);
    console.log("========================");
  }
}
