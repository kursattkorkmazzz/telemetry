import MetricData from "../types/MetricData";
export default abstract class AbstractMetricCollector {
    abstract collect(): Promise<MetricData | MetricData[]>;
}
