import MetricData from "../types/MetricData.js";

export abstract class AbstractMetricCollector {
  abstract metric_name: string;
  abstract labels?: Record<string, string>;
  abstract collect(): Promise<MetricData | MetricData[]>;
}
