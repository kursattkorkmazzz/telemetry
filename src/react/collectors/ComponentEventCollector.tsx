import React, {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import MetricData from "src/core/types/MetricData";
import { useTelemetry } from "../providers";

type ComponentEventCollectorProps = {
  tracking_event: Omit<
    keyof React.DOMAttributes<HTMLElement>,
    "children" | "dangerouslySetInnerHTML"
  >[];
  children?: ReactElement;
};

export function ComponentEventCollector(props: ComponentEventCollectorProps) {
  const telemetry = useTelemetry();
  const [clonedChildren, setClonedChildren] = useState<ReactElement | null>(
    null
  );

  // This function handles what happened when specific event occurs.
  // It creates a metric data object and publishes it to the telemetry system.
  const eventHandler = (e: Event) => {
    const labels = {
      event_type: e.type,
      component: (e as any).target.tagName,
      component_id: (e as any).target.id || "no_id",
    };
    const metricData: MetricData = {
      metric_name: "react_component_events",
      labels: labels,
      data: 1,
    };
    telemetry.publish([metricData]);
  };

  useEffect(() => {
    const eventHandlers = props.tracking_event.reduce((handlers, eventType) => {
      const currentHandler = ((props.children as ReactElement).props as any)[
        eventType as string
      ];

      handlers[eventType as string] = (e: Event) => {
        eventHandler(e);
        if (typeof currentHandler === "function") {
          currentHandler(e);
        }
      };
      return handlers;
    }, {} as Record<string, (e: Event) => void>);

    const clonned = cloneElement(props.children as ReactElement, {
      ...eventHandlers,
    });
    setClonedChildren(clonned);
  }, [props.children]);

  return clonedChildren || null;
}
