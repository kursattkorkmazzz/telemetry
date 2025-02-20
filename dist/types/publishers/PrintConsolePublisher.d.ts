import AbstractPublisher from "../../core/abstracts/AbstractPublisher";
import MetricData from "../../core/types/MetricData";
export default class PrintConsolePublisher extends AbstractPublisher {
    name: string;
    publish(data: MetricData | Array<MetricData>): Promise<void>;
    private printMetricData;
}
