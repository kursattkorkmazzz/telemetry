/**
 *
 * API Key = _wz53_1BnDMa7unPLAayjzQM1gK9tbwzH7GNqRaeZ-uOOQjmk4fOI9fJZy4eXjbktpLpn83-Dyt4Nlx2gu9sFw==
 *
 *
 */

import { InfluxPublisher } from "./core";

const influxDB = new InfluxPublisher({
  bucket: "POC Project",
  organization_id: "7ed79ea185ada884",
  token:
    "_wz53_1BnDMa7unPLAayjzQM1gK9tbwzH7GNqRaeZ-uOOQjmk4fOI9fJZy4eXjbktpLpn83-Dyt4Nlx2gu9sFw==",
  url: "http://localhost:8086",
});

influxDB.publish([
  {
    metric_name: "react_component_screen_time",
    labels: {
      type: "button",
      id: "button_id",
      user: "kursat",
    },
    data: 54,
  },
]);
