import { AbstractScheduler } from "@src/node/core/abstracts/AbstractScheduler.js";
import Status from "@src/node/core/enums/Status.js";
import ErrorCodes from "@src/node/core/utils/errors/ErrorCodes.js";

export class IntervalScheduler extends AbstractScheduler {
  status: Status;

  private collectEventTimer: any;
  private publishEventTimer: any;

  private collectIntervalInMS: number;
  private publishIntervalInMS: number;

  constructor(opts: {
    collectIntervalInMS: number;
    publishIntervalInMS: number;
  }) {
    super();
    this.collectIntervalInMS = opts.collectIntervalInMS;
    this.publishIntervalInMS = opts.publishIntervalInMS;
    this.status = Status.STOPED;
  }

  start(): void {
    if (this.status != Status.STOPED) {
      throw Error(ErrorCodes.TASK_ALREADY_STARTED);
    }
    // Preparing to collect delay
    const collectTimerCallback = () => {
      this.emit("collect");
      this.collectEventTimer = setTimeout(
        collectTimerCallback,
        this.collectIntervalInMS
      );
    };
    this.collectEventTimer = setTimeout(
      collectTimerCallback,
      this.collectIntervalInMS
    );

    // Preparing to publish delay
    const publishTimerCallback = () => {
      this.emit("publish");
      this.publishEventTimer = setTimeout(
        publishTimerCallback,
        this.publishIntervalInMS
      );
    };

    this.publishEventTimer = setTimeout(
      publishTimerCallback,
      this.publishIntervalInMS
    );

    this.status = Status.STARTED;
  }

  override stop(): void {
    clearTimeout(this.publishEventTimer);
    clearTimeout(this.collectEventTimer);
    this.status = Status.STOPED;
  }
}
