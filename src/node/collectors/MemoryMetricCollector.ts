import { AbstractMetricCollector } from "@src/node/core/abstracts/AbstractMetricCollector.js";
import MetricData from "@src/node/core/types/MetricData.js";
import os from "os";

export class MemoryMetricCollector extends AbstractMetricCollector {
  override metric_name: string;
  override labels?: Record<string, string> | undefined;

  constructor(opts: { metric_name: string; labels?: Record<string, string> }) {
    super();
    this.metric_name = opts.metric_name;
    this.labels = opts.labels;
  }

  collect(): Promise<MetricData | MetricData[]> {
    const totalMemory: number = os.totalmem() / Math.pow(1024, 3); // Convert it from Byte to GB
    const usedMemory: number =
      (os.totalmem() - os.freemem()) / Math.pow(1024, 3); // Convert it from Byte to GB

    return new Promise((resolve, reject) => {
      resolve([
        {
          metric_name: this.metric_name,
          labels: {
            ...this.labels,
            type: "total",
          },
          data: totalMemory.toFixed(2),
        },
        {
          metric_name: this.metric_name,
          labels: {
            ...this.labels,
            type: "used",
          },
          data: usedMemory.toFixed(2),
        },
      ]);
    });
  }
}
