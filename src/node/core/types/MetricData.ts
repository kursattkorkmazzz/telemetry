export type MetricDataTypes = number | string;

type MetricData = {
  metric_name: string;
  labels?: Record<string, string>;
  data: MetricDataTypes;
};
export default MetricData;
