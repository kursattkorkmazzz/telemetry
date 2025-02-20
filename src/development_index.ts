import MemoryMetricCollector from "./collectors/MemoryMetricCollector";
import Task from "@src/core/Task";
import IntervalScheduler from "./schedulers/IntervalScheduler";
import PrintConsolePublisher from "./publishers/PrintConsolePublisher";

const task = new Task("");

task
  .metricCollector(MemoryMetricCollector)
  .scheduler(IntervalScheduler, {
    collectIntervalInMS: 3000,
    publishIntervalInMS: 5000,
  })
  .publisher(PrintConsolePublisher)
  .start();
