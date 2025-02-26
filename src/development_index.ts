import { MemoryMetricCollector } from "./node/collectors/MemoryMetricCollector.js";
import { Task } from "@src/node/core/Task.js";
import { IntervalScheduler } from "./node/schedulers/IntervalScheduler.js";
import { PrintConsolePublisher } from "./node/publishers/PrintConsolePublisher.js";
import MetricDataStorage from "./node/core/libs/storage/MetricDataStorage.js";

const task = new Task();

task
  .metricCollector(MemoryMetricCollector)
  .scheduler(IntervalScheduler, {
    collectIntervalInMS: 3000,
    publishIntervalInMS: 6000,
  })
  .publisher(PrintConsolePublisher)
  .start();
