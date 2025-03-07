import React, { useState } from "react";
import { useTaskContext } from "../TaskComponent";
import { IntervalScheduler } from "../../core/schedulers/IntervalScheduler";

type IntervalSchedulerProps = {
  collectIntervalInMS: number;
  publishIntervalInMS: number;
};

export function IntervalSchedulerComponent(props: IntervalSchedulerProps) {
  const task = useTaskContext();
  const [scheduler, _] = useState(
    new IntervalScheduler({
      collectIntervalInMS: props.collectIntervalInMS,
      publishIntervalInMS: props.publishIntervalInMS,
    })
  );
  console.log("Interval Scheduler Task Context: ", task);

  return <></>;
}
