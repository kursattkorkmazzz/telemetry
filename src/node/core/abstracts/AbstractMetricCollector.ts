import MetricData from "../types/MetricData.js";

export default abstract class AbstractMetricCollector {
  abstract name: string;
  abstract collect(): Promise<MetricData | MetricData[]>;
}
