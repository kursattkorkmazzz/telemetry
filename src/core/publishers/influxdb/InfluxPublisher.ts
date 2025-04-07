import { InfluxDB, Point, WriteApi } from "@influxdata/influxdb-client-browser";
import { AbstractPublisher } from "src/core/abstracts";
import MetricData from "src/core/types/MetricData";

export class InfluxPublisher extends AbstractPublisher {
  private influxDB: InfluxDB;
  private _writeApi: WriteApi;
  private defaultTags?: Record<string, string>;

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
      writeOptions: {
        defaultTags: opts.defaultTags,
      },
    });
    this.defaultTags = opts.defaultTags;

    this._writeApi = this.influxDB.getWriteApi(
      opts.organization_id,
      opts.bucket,
      "s", // for seconds
      {
        defaultTags: this.defaultTags,
      }
    );
  }

  public publish(...metrics: MetricData[]): void {
    try {
      const pointList: Point[] = [];
      metrics.forEach((data) => {
        const point = new Point(
          InfluxPublisher.escape(data.metric_name, "measurement")
        );
        // Adds all tag into point.
        if (data.tags)
          Object.entries(data.tags).forEach(([key, value]) => {
            point.tag(
              InfluxPublisher.escape(key, "tag_key"),
              InfluxPublisher.escape(value, "tag_value")
            );
          });

        // Adds all fields int data.
        Object.entries(data.fields).forEach(([key, value]) => {
          const e_key = InfluxPublisher.escape(key, "field_key");
          switch (typeof value) {
            case "string":
              point.stringField(
                e_key,
                InfluxPublisher.escape(value, "field_value")
              );
              break;
            case "boolean":
              point.booleanField(e_key, value);
              break;
            case "number":
              if (Number.isInteger(value)) point.intField(e_key, value);
              else point.floatField(e_key, value);
              break;
          }
        });

        pointList.push(point);
      });

      this._writeApi.writePoints(pointList);

      this._writeApi
        .flush()
        .then(() => {
          console.log("Veriler başarılı bir şekilde gönderildi.");
        })
        .catch((e) => {
          console.log(
            "Metrikleri gönderilirken hata oluştu. Lütfen aşağıdaki hatayı inceleyin.\n",
            e
          );
        });
    } catch (e: any) {
      console.log("ERROR HAPPENED!");
      console.log(e);
      throw e;
    }
  }

  private static escape(
    data: string,
    data_type:
      | "measurement"
      | "field_key"
      | "field_value"
      | "tag_key"
      | "tag_value"
  ): string {
    let escaped_string: string = data;

    switch (data_type) {
      case "measurement":
        escaped_string = escaped_string.replaceAll(/,/gi, "\\,");
        escaped_string = escaped_string.replaceAll(/ /gi, "\\ ");
        break;
      case "tag_key":
      case "tag_value":
      case "field_key":
        escaped_string = escaped_string.replaceAll(/,/gi, "\\,");
        escaped_string = escaped_string.replaceAll(/ /gi, "\\ ");
        escaped_string = escaped_string.replaceAll(/=/gi, "\\=");
        break;
      case "field_value":
        escaped_string = escaped_string.replaceAll(/"/gi, '\\"');
        escaped_string = escaped_string.replaceAll(/\\/gi, "\\\\");
        break;
    }
    return escaped_string;
  }
}
