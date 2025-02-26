import AbstractMetricCollector from "@src/node/core/abstracts/AbstractMetricCollector.js";
import MetricData from "@src/node/core/types/MetricData.js";
import os from "os";

export class MemoryMetricCollector extends AbstractMetricCollector {
  override name: string = "Total_Memory";
  collect(): Promise<MetricData | MetricData[]> {
    const totalMemory: number = os.totalmem() / Math.pow(1024, 3); // Convert it from Byte to GB
    const usedMemory: number =
      (os.totalmem() - os.freemem()) / Math.pow(1024, 3); // Convert it from Byte to GB

    return new Promise((resolve, reject) => {
      resolve([
        {
          name: this.name,
          data: totalMemory.toFixed(2),
          timestamp: Date.now(),
        },
        {
          name: this.name,
          data: usedMemory.toFixed(2),
          timestamp: Date.now(),
        },
      ]);
    });
  }
}
