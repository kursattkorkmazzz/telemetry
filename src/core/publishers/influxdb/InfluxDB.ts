import { InfluxDB, WriteApi } from "@influxdata/influxdb-client-browser";
import { AbstractPublisher } from "src/core/abstracts";
import MetricData from "src/core/types/MetricData";

export class InfluxPublisher extends AbstractPublisher {
  private influxDB: InfluxDB;
  private _writeApi: WriteApi;
  constructor(opts: {
    url: string;
    token: string;
    organization_id: string;
    bucket: string;
    defaultTags?: Record<string, string>;
  }) {
    super();
    this.influxDB = new InfluxDB({
      url: opts.url,
      token: opts.token,
    });
    this._writeApi = this.influxDB.getWriteApi(
      opts.organization_id,
      opts.bucket,
      "ms"
    );
  }

  public publish(data: MetricData[]): void {
    try {
      console.log(data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
