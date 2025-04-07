import MetricData from "../types/MetricData";

export default class LineProtocolConverter {
  public static toLineProtocol(data: MetricData | MetricData[]): string[] {
    const generateString = (data: MetricData): string => {
      const measurement = this.generateMeasurementName(data);
      const tagSet = this.generateTagSet(data);
      const fieldSet = this.generateFieldSet(data);

      return (
        measurement +
        "," +
        tagSet.join(",") +
        " " +
        fieldSet.join(",") +
        " " +
        Date.now()
      );
    };

    if (Array.isArray(data)) {
      return data.map((d) => generateString(d));
    } else {
      return [generateString(data)];
    }
  }

  private static generateMeasurementName(data: MetricData): string {
    if (data.metric_name.startsWith("_")) {
      throw new Error(
        `Metric name cannot be start with underscore (_). {${data.metric_name}}`,
        {
          cause: "METRIC_NAME_RESTRICTION",
        }
      );
    }

    return this.escape(data.metric_name, {
      comma_escape: true,
      space_escape: true,
    });
  }

  private static generateTagSet(data: MetricData): string[] {
    if (!data.tags) return [];
    const tags: string[] = [];

    Object.entries(data.tags).forEach(([key, value]: [string, string]) => {
      if (key.startsWith("_")) {
        // Checks ket is starts with underscore.
        throw new Error(
          `Tag keys cannot be start with underscore (_). {${key}}`,
          {
            cause: "TAG_KEY_RESTRICTION",
          }
        );
      }
      if (value.length <= 0) return; // Check values is empty or not.

      tags.push(
        `${this.escape(key, {
          comma_escape: true,
          equals_escape: true,
          space_escape: true,
        })}=${this.escape(value, {
          comma_escape: true,
          equals_escape: true,
          space_escape: true,
        })}`
      );
    });

    return tags;
  }

  private static generateFieldSet(data: MetricData): string[] {
    const fields: string[] = [];

    Object.entries(data.fields).forEach(([key, value]) => {
      if (key.startsWith("_")) {
        // Checks ket is starts with underscore.
        throw new Error(
          `Field keys cannot be start with underscore (_). {${key}}`,
          {
            cause: "FIELD_KEY_RESTRICTION",
          }
        );
      }

      fields.push(
        `${this.escape(key, {
          comma_escape: true,
          equals_escape: true,
          space_escape: true,
        })}=${
          typeof value === "string"
            ? `"${this.escape(value, {
                double_quate_escape: true,
                backslash_escape: true,
              })}"`
            : value
        }`
      );
    });

    return fields;
  }

  private static escape(
    data: string,
    escapers: {
      comma_escape?: boolean;
      equals_escape?: boolean;
      space_escape?: boolean;
      double_quate_escape?: boolean;
      backslash_escape?: boolean;
    }
  ): string {
    let escaped_string: string = data;
    if (escapers.comma_escape) {
      escaped_string = escaped_string.replaceAll(/,/gi, "\\,");
    }

    if (escapers.equals_escape) {
      escaped_string = escaped_string.replaceAll(/=/gi, "\\=");
    }

    if (escapers.space_escape) {
      escaped_string = escaped_string.replaceAll(/ /gi, "\\ ");
    }

    if (escapers.double_quate_escape) {
      escaped_string = escaped_string.replaceAll(/"/gi, '\\"');
    }

    if (escapers.backslash_escape) {
      escaped_string = escaped_string.replaceAll(/\\/gi, "\\\\");
    }

    return escaped_string;
  }
}
