export type MetricDataTypes = number | string;
type MetricData = {
    name: string;
    data: MetricDataTypes | Array<MetricDataTypes>;
    timestamp: number | Array<number>;
};
export default MetricData;
