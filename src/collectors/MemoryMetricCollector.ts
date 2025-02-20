import AbstractMetricCollector from "@src/core/abstracts/AbstractMetricCollector";
import MetricData from "@src/core/types/MetricData";
import os from "os";

export default class MemoryMetricCollector extends AbstractMetricCollector {
  collect(): Promise<MetricData | MetricData[]> {
    const totalMemory: number = os.totalmem() / Math.pow(1024, 3); // Convert it from Byte to GB
    const usedMemory: number =
      (os.totalmem() - os.freemem()) / Math.pow(1024, 3); // Convert it from Byte to GB

    return new Promise((resolve, reject) => {
      resolve([
        {
          name: "Total_Memory",
          data: totalMemory.toFixed(2),
          timestamp: Date.now(),
        },
        {
          name: "Used_Memory",
          data: usedMemory.toFixed(2),
          timestamp: Date.now(),
        },
      ]);
    });
  }
}
