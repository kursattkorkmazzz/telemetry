import MetricData from "../types/MetricData.js";

export default interface IMetricCollector {
  collect(): Promise<MetricData | MetricData[]>;
}
