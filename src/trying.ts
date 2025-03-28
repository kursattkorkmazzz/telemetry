import { Task } from "./core";
import { CounterMetricCollector } from "./core/collectors/CounterMetricCollector";
import { PrometheusCounterPublisher } from "./core/publishers/prometheus/implementations/PrometheusCounterPublisher";
import { IntervalScheduler } from "./core/schedulers/IntervalScheduler";

const clickEventCollector = new CounterMetricCollector({
  metric_name: "react_component_events_total",
  labels: {
    project_id: "my_project",
    event_type: "click",
    component: "button",
    component_id: "#button-id",
  },
});

const hoverEventCollector = new CounterMetricCollector({
  metric_name: "react_component_events_total",
  labels: {
    project_id: "my_project",
    event_type: "hover",
    component: "button",
    component_id: "#button-id",
  },
});

const componentScreenTimeCollector = new CounterMetricCollector({
  metric_name: "react_component_screen_time_total",
  labels: {
    project_id: "my_project",
    component: "button",
    component_id: "#button-id",
  },
});

const scheduler = new IntervalScheduler({
  collectIntervalInMS: 2000,
  publishIntervalInMS: 2000,
});

const publisher = new PrometheusCounterPublisher({
  prometheus_url: "http://localhost:9092/metrics",
  help: "React Component Event Metrics",
});

const task = new Task();
task.metricCollectors.add(clickEventCollector);
task.metricCollectors.add(hoverEventCollector);
task.metricCollectors.add(componentScreenTimeCollector);
task.scheduler = scheduler;
task.publisher = publisher;

task.start();

setInterval(() => {
  clickEventCollector.increment(Math.floor(Math.random() * 10));
  hoverEventCollector.increment(Math.floor(Math.random() * 10));
  componentScreenTimeCollector.increment(Math.floor(Math.random() * 100));
}, 500);
