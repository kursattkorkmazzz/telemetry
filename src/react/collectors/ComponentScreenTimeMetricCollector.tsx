/*
import React from "react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { CollectorComponentProps } from "../types/CollectorComponentProps";
import { InstantMetricCollector } from "../../core/index";
import { useTaskContext } from "../TaskComponent";

type ComponentScreenTimeMetricCollectorProps = HTMLAttributes<HTMLDivElement> &
  CollectorComponentProps;

// This will need telemetry provider to register Task to TelemetryAS. It will create task for specific purpose.
export function ComponentScreenTimeMetricCollector(
  props: ComponentScreenTimeMetricCollectorProps
) {
  const ref = useRef<HTMLDivElement>(null);
  const task = useTaskContext();

  console.log("Task: ", task);

  const [metricCollector, _] = useState(
    new InstantMetricCollector({
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
    metricCollector.set(screenTime);
  }, [screenTime]);

  return <div ref={ref}>{props.children}</div>;
}
*/
