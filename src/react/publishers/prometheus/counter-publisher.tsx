import React, { useEffect, useState } from "react";
import { PrometheusCounterPublisher } from "src/core/publishers/prometheus/implementations/PrometheusCounterPublisher";
import { useTelemetry } from "src/react/providers";

type PrometheusCounterPublisherComponentProps = {
  prometheus_url: string;
  help?: string;
};
export default function PrometheusCounterPublisherComponent(
  props: PrometheusCounterPublisherComponentProps
) {
  const publisherId = "prometheus_counter_publisher";
  const [counterPublisher, _] = useState(
    new PrometheusCounterPublisher({
      prometheus_url: props.prometheus_url,
      help: props.help,
    })
  );

  const telemetryContext = useTelemetry();
  useEffect(() => {
    telemetryContext.registerPublisher(counterPublisher, publisherId);
    return () => {
      telemetryContext.unregisterPublisher(publisherId);
    };
  }, []);
  return <></>;
}
