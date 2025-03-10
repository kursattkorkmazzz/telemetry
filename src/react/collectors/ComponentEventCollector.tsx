import React, { useCallback, useEffect, useRef, useState } from "react";
import { HTMLAttributes } from "react";
import { CounterMetricCollector } from "src/core";
import { useTelemetryConfiguration } from "../configurer/TelemetryConfigurationManager";
import { MetricDataStorage } from "src/core/core/libs/storage/MetricDataStorage";
import { useTaskContext } from "../TaskComponent";

type ComponentEventCollectorProps = HTMLAttributes<HTMLDivElement> & {
  tracking_event: (keyof HTMLElementEventMap)[];
  publish_every_ms?: number;
};

export function ComponentEventCollector(props: ComponentEventCollectorProps) {
  const configuration = useTelemetryConfiguration();
  const taskContext = useTaskContext();

  const [publishHandler, setPublisherHandler] = useState<() => void>(() => {});
  const [sending, setSending] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const [metricCollectorList, setMetricCollectors] = useState<
    CounterMetricCollector[]
  >([]);
  const [metricStorage, setMetricStorage] = useState<MetricDataStorage>(
    new MetricDataStorage()
  );

  useEffect(() => {
    if (parentRef.current) {
      const children = parentRef.current.children[0] as HTMLElement;

      // Configuration PART
      props.tracking_event.forEach((event_type: string) => {
        const labels = {
          project_name: configuration.project_name,
          event_type: event_type,
          component: children.tagName.toLowerCase(),
          component_id: children.id || "no_id",
        };

        const mc = new CounterMetricCollector({
          metric_name: "react_component_events_counter",
          labels: labels,
        });
        setMetricCollectors((prev) => [...prev, mc]);

        // Data Collection PART
        children.addEventListener(event_type, () => {
          mc.increment(1);
          setMetricCollectors((prev) => {
            const filtered = prev.filter(
              (mc) => JSON.stringify(mc.labels) !== JSON.stringify(labels)
            );
            filtered.push(mc);
            return [...filtered];
          });
        });
      });
    }
  }, [parentRef]);

  // 2. Adjusting publishing data scheduling.
  useEffect(() => {
    window.addEventListener("beforeunload", publishHandler);
    window.addEventListener("close", publishHandler);
    return () => {
      window.removeEventListener("beforeunload", publishHandler);
      window.addEventListener("close", publishHandler);
    };
  }, [metricCollectorList]);

  useEffect(() => {
    setPublisherHandler(() => {
      setSending(true);
      const mds = new MetricDataStorage();
      metricCollectorList.forEach((metric) => {
        mds.add({
          data: metric.counter,
          metric_name: metric.metric_name,
          labels: metric.labels,
        });
      });
      taskContext.publish(mds.getAll());
    });
  }, [metricCollectorList]);

  useEffect(() => {
    if (sending) {
      setMetricCollectors((prev) => {
        const filtered = prev.map((mc) => {
          mc.counter = 0;
          return mc;
        });

        return [...filtered];
      });
      setSending(false);
    }
  }, [sending]);
  return <div {...props} ref={parentRef} />;
}
