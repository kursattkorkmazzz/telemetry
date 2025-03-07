import React from "react";

import { useTaskContext } from "../../index";

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
