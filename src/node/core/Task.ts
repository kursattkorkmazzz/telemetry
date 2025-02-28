import AbstractMetricCollector from "./abstracts/AbstractMetricCollector.js";
import AbstractPublisher from "./abstracts/AbstractPublisher.js";
import AbstractScheduler from "./abstracts/AbstractScheduler.js";
import Status from "./enums/Status.js";

import Storage from "./libs/storage/Storage.js";
import MetricData from "./types/MetricData.js";
import ErrorCodes from "./utils/errors/ErrorCodes.js";
import PrintError from "./utils/errors/PrintError.js";

export class Task {
  public _status: Status;
  public metricCollectors: Storage<AbstractMetricCollector>;
  public scheduler: AbstractScheduler | null;
  public publisher: AbstractPublisher | null;

  private _collectedData = new Storage<MetricData>();

  constructor() {
    this.metricCollectors = new Storage<AbstractMetricCollector>();
    this.publisher = null;
    this.scheduler = null;
    this._status = Status.STOPED;
    this._collectedData.removeAll();
  }

  public async start() {
    try {
      // If not an error which means it meet conditions to start.
      this.checkStartCondition();

      // We check _scheduler is defined at checkStartCondition function.
      this.scheduler!.start();
      // Registering _scheduler events.WW
      this.scheduler!.on("collect", () => this.collectEventCallback());

      this.scheduler!.on("publish", () => this.publishEventCallback());

      this._status = Status.STARTED;
    } catch (e: any) {
      PrintError(e);
      throw new Error(ErrorCodes.TASK_CANNOT_BE_STARTED);
    }
  }

  public async stop() {
    try {
      // If not an error which means it meet conditions to start.
      this.checkStopCondition();

      // We check _scheduler is defined at checkStartCondition function.
      this.scheduler!.stop();
      // Registering _scheduler events.
      this.scheduler!.off("collect", this.collectEventCallback);
      this.scheduler!.off("publish", this.publishEventCallback);

      this._status = Status.STOPED;
    } catch (e: any) {
      PrintError(e);
      throw new Error(ErrorCodes.TASK_CANNOT_BE_STOPPED);
    }
  }

  private collectEventCallback() {
    this.metricCollectors.forEach((mc: AbstractMetricCollector) => {
      mc.collect().then((data: MetricData | MetricData[]) => {
        this._collectedData.add(data);
      });
    });
  }

  private publishEventCallback() {
    this.publisher!.publish(this._collectedData.getItems());
    this._collectedData.removeAll();
  }

  /**
   * Checks if the task can be started by verifying its current status and dependencies.
   *
   * @throws {Error} If the task has already been started.
   * @throws {Error} If the scheduler is not defined.
   * @throws {Error} If the publisher is not defined.
   */
  private checkStartCondition(): void {
    if (this._status === Status.STARTED) {
      throw new Error(ErrorCodes.TASK_ALREADY_STARTED);
    }
    if (this.scheduler === null) {
      throw new Error(ErrorCodes.SCHEDULER_NOT_DEFINED);
    }
    if (this.publisher === null) {
      throw new Error(ErrorCodes.PUBLISHER_NOT_DEFINED);
    }
  }

  /**
   * Checks if the task can be stoped by verifying its current status and dependencies.
   *
   * @throws {Error} If the task has already been stoped.
   * @throws {Error} If the scheduler is not defined.
   * @throws {Error} If the publisher is not defined.
   */
  private checkStopCondition(): void {
    if (this._status === Status.STOPED) {
      throw new Error(ErrorCodes.TASK_ALREADY_STOPPED);
    }
    if (this.scheduler === null) {
      throw new Error(ErrorCodes.SCHEDULER_NOT_DEFINED);
    }
    if (this.publisher === null) {
      throw new Error(ErrorCodes.PUBLISHER_NOT_DEFINED);
    }
  }
}
