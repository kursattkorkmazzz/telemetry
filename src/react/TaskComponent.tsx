import React, { useEffect } from "react";
import { PrintConsolePublisher, Task } from "src/core";
import { createContext, useState, useContext } from "react";
import { AbstractPublisher } from "src/core/core/abstracts/AbstractPublisher";
import { AbstractScheduler } from "src/core/core/abstracts/AbstractScheduler";
import { AbstractMetricCollector } from "src/core/core/abstracts/AbstractMetricCollector";

type TaskContextType = {
  setPublisher: (publisher: AbstractPublisher) => void;
  setScheduler: (scheduler: AbstractScheduler) => void;
  setMetricCollectors: (metrics: AbstractMetricCollector[]) => void;
};

export const TaskContext = createContext<TaskContextType | null>(null);

export function useTaskContext() {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error("useTaskContext must be used within a TaskComponent");
  }
  return taskContext;
}

export function TaskComponent(props: { children?: React.ReactNode }) {
  const [publisher, setPublisher] = useState<AbstractPublisher | null>(null);
  const [scheduler, setScheduler] = useState<AbstractScheduler | null>(null);
  const [metrics, setMetrics] = useState<AbstractMetricCollector[]>([]);

  return (
    <TaskContext.Provider
      value={{
        setPublisher,
        setScheduler,
        setMetricCollectors: setMetrics,
      }}
    >
      {props.children}
    </TaskContext.Provider>
  );
}
