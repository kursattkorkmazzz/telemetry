import axios from "axios";

export default async function sendPayloadToPrometheus(
  prometheus_url: string,
  payload: string
): Promise<void> {
  try {
    const response = await axios.post(prometheus_url, payload, {
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      },
    });
    if (response.status == 202) {
      return;
    }
    throw new Error(
      `Failed to send data to Prometheus. Status: ${response.status}`
    );
  } catch (e) {
    throw e;
  }
}
