import MetricData, { MetricDataTypes } from "../../types/MetricData.js";
import Storage from "./Storage.js";

export default class MetricDataStorage extends Storage<MetricData> {
  constructor() {
    super();
  }

  public merge(): Promise<void> {
    return new Promise((resolve: () => void, reject) => {
      try {
        let mergedData: { [key: string]: MetricData } = {};

        this._storage.forEach((item: MetricData) => {
          const { name, data, timestamp } = item;

          // If the object not contain anything about name, initialize it.
          if (!mergedData[name]) {
            mergedData[name] = {
              name: name,
              data: [],
              timestamp: [],
            };
          }

          const isDataArray = Array.isArray(data);
          const isTimestampArray = Array.isArray(timestamp);

          if (isDataArray) {
            (mergedData[name].data as Array<MetricDataTypes>).push(...data);
          } else {
            (mergedData[name].data as Array<MetricDataTypes>).push(data);
          }

          if (isTimestampArray) {
            if (!isDataArray || data.length < timestamp.length) {
              (mergedData[name].timestamp as Array<MetricDataTypes>).push(
                timestamp[0]
              );
              return;
            }

            (mergedData[name].timestamp as Array<MetricDataTypes>).push(
              ...timestamp
            );
          } else {
            if (isDataArray) {
              const pump = new Array(data.length).fill(timestamp);

              (mergedData[name].timestamp as Array<MetricDataTypes>).push(
                ...pump
              );
              return;
            }
            (mergedData[name].timestamp as Array<MetricDataTypes>).push(
              timestamp
            );
          }
        });

        this.removeAll();
        Object.values(mergedData).forEach((item: MetricData) => {
          this.add(item);
        });
        resolve();
      } catch (e: any) {
        reject(e);
      }
    });
  }
}
