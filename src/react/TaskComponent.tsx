import React from "react";
import { createContext, useState, useContext } from "react";
import { AbstractPublisher } from "src/core/abstracts/AbstractPublisher";

type TaskContextType = {
  publish: (data: unknown) => void;
  addPublisher: (publisher: AbstractPublisher) => void;
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
  const [publishers, setPublishers] = useState<AbstractPublisher[]>([]);

  return (
    <TaskContext.Provider
      value={{
        addPublisher(publisher) {
          setPublishers([...publishers, publisher]);
        },
        publish(data: unknown) {
          console.log("DATA: " + JSON.stringify(data, null, 3));

          publishers.forEach((publisher) => {
            publisher.publish(data);
          });
        },
      }}
    >
      {props.children}
    </TaskContext.Provider>
  );
}
