import { MetricDataStorageType } from "src/core/utils/storage/MetricDataStorage";
import { AbstractPublisher } from "../../../abstracts/AbstractPublisher";
import MetricData from "src/core/types/MetricData";

export abstract class PrometheusPublisher extends AbstractPublisher {
  abstract prometheus_url: string;
  abstract help?: string;

  // CONSTANTS
  protected readonly contentType = "text/plain; version=0.0.4; charset=utf-8";
  protected readonly contentEncoding = "gzip";

  // We assume <MetricData[]> contains data with same metric name.
  abstract publish(items: MetricData[]): Promise<void>;
}
