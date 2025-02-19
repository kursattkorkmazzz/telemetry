import MetricData from "../types/MetricData.js";

export default abstract class AbstractMetricCollector {
  abstract collect(): Promise<MetricData | MetricData[]>;
}
