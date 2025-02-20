import MetricData from "../../../../core/types/MetricData.js";
import Storage from "./Storage.js";
export default class MetricDataStorage extends Storage<MetricData> {
    constructor();
    merge(): Promise<void>;
}
