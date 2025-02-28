import React, { useContext, useEffect, useState } from "react";
import { TaskContext, useTaskContext } from "../TaskComponent";
import { IntervalScheduler } from "@src/node";

type IntervalSchedulerProps = {
  collectIntervalInMS: number;
  publishIntervalInMS: number;
};

export function IntervalSchedulerComponent(props: IntervalSchedulerProps) {
  const task = useContext(TaskContext);
  const [scheduler, _] = useState(
    new IntervalScheduler({
      collectIntervalInMS: props.collectIntervalInMS,
      publishIntervalInMS: props.publishIntervalInMS,
    })
  );

  useEffect(() => {
    task?.setScheduler(scheduler);
  }, [task, scheduler]);

  console.log("Interval Scheduler Task Context: ", task);

  return <></>;
}
