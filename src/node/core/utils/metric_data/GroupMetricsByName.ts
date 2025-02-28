import MetricData from "../../types/MetricData";

export default function GroupMetricsByName(
  items: MetricData[]
): MetricData[][] {
  const metricDataMap = new Map<string, MetricData[]>();

  items.forEach((item) => {
    if (!metricDataMap.has(item.metric_name)) {
      metricDataMap.set(item.metric_name, []);
    }
    metricDataMap.get(item.metric_name)!.push(item);
  });
  return Array.from(metricDataMap.values());
}
