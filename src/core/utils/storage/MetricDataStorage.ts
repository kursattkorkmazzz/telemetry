import MetricData from "../../types/MetricData";

export type MetricDataStorageType = {
  [key: string]: MetricData[];
};

export class MetricDataStorage {
  storage: MetricDataStorageType = {};

  public add(data: MetricData | MetricData[]) {
    if (Array.isArray(data)) {
      data.forEach((d) => this.addOne(d));
    } else {
      this.addOne(data);
    }
  }
  public getAll(): MetricDataStorageType {
    return this.storage;
  }
  public clear() {
    this.storage = {};
  }
  public removeAllByMetricName(name: string) {
    delete this.storage[name];
  }
  private addOne(d: MetricData) {
    let keyString: string = d.metric_name;

    if (this.storage[keyString]) {
      this.storage[keyString].push(d);
    } else {
      this.storage[keyString] = [d];
    }
  }
}
