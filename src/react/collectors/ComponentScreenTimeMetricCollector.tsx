import React from "react";
import { CounterMetricCollector } from "@src/node/collectors/CounterMetricCollector";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

type ComponentScreenTimeMetricCollectorProps =
  HTMLAttributes<HTMLDivElement> & {
    metric_name: string;
    labels?: Record<string, string>;
  };

// This will need telemetry provider to register Task to TelemetryAS. It will create task for specific purpose.
export function ComponentScreenTimeMetricCollector(
  props: ComponentScreenTimeMetricCollectorProps
) {
  const ref = useRef<HTMLDivElement>(null);

  const [metricCollector, _] = useState(
    new CounterMetricCollector({
      metric_name: props.metric_name,
      labels: props.labels,
    })
  );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [screenTime, setScreenTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

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
        setScreenTime(Date.now() - startTime);
        setStartTime(0);
      }
    }
  }, [isVisible]);

  // Metric Collector is adjusting.
  useEffect(() => {
    metricCollector.counter = screenTime;
  }, [screenTime]);

  return <div ref={ref}>{props.children}</div>;
}
