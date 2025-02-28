import { AbstractPublisher } from "../../../core/abstracts/AbstractPublisher";
import MetricData from "../../../core/types/MetricData";

export abstract class PrometheusPublisher extends AbstractPublisher {
  abstract prometheus_url: string;
  abstract help?: string;
  // CONSTANTS

  protected contentType = "text/plain; version=0.0.4; charset=utf-8";
  protected contentEncoding = "gzip";

  // We assume <MetricData[]> contains data with same metric name.
  abstract publish(items: MetricData[]): Promise<void>;
}
