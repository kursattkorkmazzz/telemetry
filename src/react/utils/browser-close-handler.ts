import { emitWarning } from "process";
import { AbstractPublisher } from "src/core";
import MetricData from "src/core/types/MetricData";

/**
 * @param cb - Callback function that returns metric data to be sent or saved.
 * The function should return either a single MetricData object or an array of MetricData objects.
 * @returns A function that removes the event listeners when called.
 * This is useful for cleanup in React components or other contexts where you need to remove the listeners.
 */
export default function browserCloseHandler(
  cb: () => MetricData | MetricData[]
): Function {
  if (window) {
    const closeHandler = () => {
      saveDataToLocalStorage(cb());
    };
    window.addEventListener("beforeunload", closeHandler);
    return () => {
      window.removeEventListener("beforeunload", closeHandler);
    };
  }

  return () => {};
}

function saveDataToLocalStorage(data: MetricData | MetricData[]) {
  if (localStorage) {
    let dataWillBeStore: MetricData[] = [];

    const lastData = localStorage.getItem("willSendMetricData");

    if (lastData) {
      dataWillBeStore = JSON.parse(lastData) as MetricData[];
    }

    const arrayData: MetricData[] = Array.isArray(data) ? data : [data];
    if (arrayData.length <= 0) return;

    dataWillBeStore.push(
      ...arrayData.map((d) => {
        return {
          ...d,
          timestamp: Date.now(),
        };
      })
    );

    const stringifiedData = JSON.stringify(dataWillBeStore);
    localStorage.setItem("willSendMetricData", stringifiedData);
  }
}

export function sendSavedDataToPublisher(
  publishFunction: (data: MetricData[], ...args: any) => void
) {
  if (localStorage) {
    const stringifiedData = localStorage.getItem("willSendMetricData");
    if (stringifiedData) {
      const parsedData: MetricData[] = JSON.parse(stringifiedData);

      publishFunction(parsedData);
      localStorage.removeItem("willSendMetricData");
      //console.log("Data which is previous session, sent to publisher.");
      //console.log(JSON.stringify(parsedData, null, 3));
    }
  }
}
