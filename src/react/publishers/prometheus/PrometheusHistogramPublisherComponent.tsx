import React, { useEffect, useState } from "react";
import { PrometheusHistogramPublisher } from "@src/node/publishers/prometheus";
import { useTaskContext } from "@src/react/TaskComponent";

type PrometheusHistogramPublisherProps = {
  prometheus_url: string;
  buckets: number[];
  help?: string;
};

export function PrometheusHistogramPublisherComponent(
  props: PrometheusHistogramPublisherProps
) {
  const task = useTaskContext();
  console.log("Prometheus Histrogram Publisher Task Context: ", task);

  return <></>;
}
