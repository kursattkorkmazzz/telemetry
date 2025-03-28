import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { HTMLAttributes } from "react";
import { CounterMetricCollector } from "src/core";
import { useTelemetryConfiguration } from "../configurer/TelemetryConfigurationManager";
import { MetricDataStorage } from "src/core/libs/storage/MetricDataStorage";
import { useTaskContext } from "../TaskComponent";
import MetricData from "src/core/types/MetricData";

type ComponentEventCollectorProps = HTMLAttributes<HTMLDivElement> & {
  tracking_event: (keyof HTMLElementEventMap)[];
  publish_every_ms?: number;
};

export function ComponentEventCollector(props: ComponentEventCollectorProps) {
  const configuration = useTelemetryConfiguration();
  const taskContext = useTaskContext();
  const parentRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(MetricDataStorageReducer, []);

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
        // Data Collection PART
        children.addEventListener(event_type, () => {
          dispatch({
            type: "load",
            payload: {
              metric_name: "component_event",
              labels: labels,
              data: 1,
            },
          });
        });
      });
    }
  }, [parentRef]);

  // 2. Adjusting publishing data scheduling.
  useEffect(() => {
    /* TODO
    window.addEventListener("beforeunload", );
    window.addEventListener("close", );
    return () => {
      window.removeEventListener("beforeunload", );
      window.addEventListener("close", );
    };*/
  }, []);

  return <div {...props} ref={parentRef} />;
}

/**  REDUCER and TYPES  */

type ActionType = {
  type: "load" | "clear";
  payload: MetricData;
};

function MetricDataStorageReducer(prev: MetricData[], action: ActionType) {
  return prev;
}
