import MemoryMetricCollector from "./collectors/MemoryMetricCollector";
import PrintConsolePublisher from "@src/publishers/PrintConsolePublisher.js";
import IntervalScheduler from "@src/schedulers/IntervalScheduler.js";
import Task from "@src/Task.js";

const task = new Task();

task
  .metricCollector(MemoryMetricCollector)
  .scheduler(IntervalScheduler, 3000, 5000)
  .publisher(PrintConsolePublisher)
  .start();
