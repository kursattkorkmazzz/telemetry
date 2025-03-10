import React, { useEffect, useRef, useState } from "react";
import { HTMLAttributes } from "react";
import { CounterMetricCollector } from "src/core";
import { useTelemetryConfiguration } from "../configurer/TelemetryConfigurationManager";

type ComponentEventCollectorProps = HTMLAttributes<HTMLDivElement> & {
  tracking_event: (keyof HTMLElementEventMap)[];
  publish_every_ms?: number;
};

export function ComponentEventCollector(props: ComponentEventCollectorProps) {
  const configuration = useTelemetryConfiguration();
  const parentRef = useRef<HTMLDivElement>(null);

  const [metricCollectorList, setMetricCollectors] = useState<
    CounterMetricCollector[]
  >([]);

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

      // 1. Adjusting publishing data scheduling.
    }
  }, [parentRef]);

  // 2. Adjusting publishing data scheduling.
  useEffect(() => {
    console.log("Mount Effect");

    window.addEventListener("beforeunload", () => {
      //console.log("AAAAA");
    });

    return () => {
      console.log("Unmount Effect");
      // Restore events.
    };
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(metricCollectorList, null, 3));
  }, [metricCollectorList]);
  return <div {...props} ref={parentRef} />;
}
