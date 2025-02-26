import React from "react";
import { CounterMetricCollector } from "@src/node/collectors/CounterMetricCollector";
import { Task } from "@src/node/core/Task";
import { PrintConsolePublisher } from "@src/node/publishers/PrintConsolePublisher";
import { IntervalScheduler } from "@src/node/schedulers/IntervalScheduler";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

type ComponentScreenTimeMetricCollectorProps =
  HTMLAttributes<HTMLDivElement> & {
    metric_name: string;
    getTime?: (ms: number) => void;
  };

// This will need telemetry provider to register Task to TelemetryAS. It will create task for specific purpose.
export function ComponentScreenTimeMetricCollector(
  props: ComponentScreenTimeMetricCollectorProps
) {
  const ref = useRef<HTMLDivElement>(null);

  const [metricCollector, _] = useState(
    new CounterMetricCollector("screen_time_collector")
  );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [screenTime, setScreenTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  // Sets the task for this component.
  useEffect(() => {
    const task = new Task();
    task._metricCollectors.add(metricCollector);
    task.scheduler(IntervalScheduler, {
      collectIntervalInMS: 1000,
      publishIntervalInMS: 6000,
    });
    task.publisher(PrintConsolePublisher);
    task.start();
    return () => {
      task.stop();
    };
  }, []);

  // Checks the element is visible or not.
  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        },
        {
          root: null,
          threshold: 1,
        }
      );

      observer.observe(ref.current);
    }
  }, []);

  // Calculating the screen time.
  useEffect(() => {
    if (isVisible) {
      setStartTime(Date.now());
    } else {
      if (startTime != 0) {
        setScreenTime(screenTime + (Date.now() - startTime));
        setStartTime(0);
      }
    }
  }, [isVisible]);

  // Metric Collector is adjusting.
  useEffect(() => {
    metricCollector.counter = screenTime;
  }, [screenTime]);

  // Screen Up Time.
  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
}
