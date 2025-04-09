import MetricData from "../types/MetricData";

export abstract class AbstractPublisher {
  abstract publish(...args: MetricData[]): void;
}
