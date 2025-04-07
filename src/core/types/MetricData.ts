export type MetricDataTypes = number | string;
export type FieldType = Record<string, number | boolean | string>;
export type TagType = Record<string, string>;
type MetricData = {
  metric_name: string;
  tags?: TagType;
  fields: FieldType;
};
export default MetricData;
