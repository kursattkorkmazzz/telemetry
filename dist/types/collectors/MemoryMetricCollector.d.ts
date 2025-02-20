import AbstractMetricCollector from "../../core/abstracts/AbstractMetricCollector";
import MetricData from "../../core/types/MetricData";
export default class MemoryMetricCollector extends AbstractMetricCollector {
    collect(): Promise<MetricData | MetricData[]>;
}
