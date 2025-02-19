import MetricDataStorage from "./libs/storage/MetricDataStorage.js";

const metricStorage = new MetricDataStorage();
metricStorage.add({
  name: "CPU_USAGE",
  data: 10,
  timestamp: 1.5,
});

metricStorage.add([
  {
    name: "CPU_USAGE",
    data: 15,
    timestamp: 5.5,
  },
  {
    name: "CPU_USAGE",
    data: [99, 100],
    timestamp: 5.9,
  },
  {
    name: "CPU_USAGE",
    data: [32],
    timestamp: [7, 8],
  },
]);

metricStorage.add({
  name: "MEMORY_USAGE",
  data: 1024,
  timestamp: 0,
});
metricStorage.add({
  name: "MEMORY_USAGE",
  data: 4096,
  timestamp: 3,
});

metricStorage.merge().then(() => {
  console.log(JSON.stringify(metricStorage.getItems(), null, 2));
});
