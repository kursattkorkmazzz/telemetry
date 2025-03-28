import MetricData from "../types/MetricData";

export abstract class AbstractMetricCollector {
  abstract metric_name: string;
  abstract labels?: Record<string, string>;
  abstract collect(): Promise<MetricData | MetricData[]>;
}
