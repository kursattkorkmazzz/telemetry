import AbstractMetricCollector from "./core/abstracts/AbstractMetricCollector.js";
import AbstractPublisher from "./core/abstracts/AbstractPublisher.js";
import AbstractScheduler from "./core/abstracts/AbstractScheduler.js";
import Status from "./core/enums/Status.js";

import MetricDataStorage from "./core/libs/storage/MetricDataStorage.js";
import Storage from "./core/libs/storage/Storage.js";
import MetricData from "./core/types/MetricData.js";
import ErrorCodes from "./core/utils/errors/ErrorCodes.js";
import PrintError from "./core/utils/errors/PrintError.js";

export default class Task {
  private _status: Status;
  private _metricCollectors: Storage<AbstractMetricCollector>;
  private _scheduler: AbstractScheduler | null;
  private _publisher: AbstractPublisher | null;

  private _collectedData = new MetricDataStorage();

  constructor() {
    this._metricCollectors = new Storage<AbstractMetricCollector>();
    this._scheduler = null;
    this._publisher = null;
    this._status = Status.STOPED;
    this._collectedData.removeAll();
  }

  public metricCollector(
    mcClass: new (...args: any) => AbstractMetricCollector,
    ...args: any
  ) {
    const mcInstance = new mcClass(...args);
    this._metricCollectors.add(mcInstance);
    return this;
  }

  public scheduler(
    schedulerClass: new (...args: any) => AbstractScheduler,
    ...args: any
  ) {
    this._scheduler = new schedulerClass(...args);
    return this;
  }

  public publisher(
    publisherClass: new (...args: any) => AbstractPublisher,
    ...args: any
  ) {
    this._publisher = new publisherClass(...args);
    return this;
  }

  public async start(...args: any) {
    try {
      // If not an error which means it meet conditions to start.
      this.checkStartCondition();

      // We check _scheduler is defined at checkStartCondition function.
      this._scheduler!.start(...args);
      // Registering _scheduler events.WW
      this._scheduler!.on("collect", () => this.collectEventCallback());

      this._scheduler!.on("publish", () => this.publishEventCallback());

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
      this._scheduler!.stop();
      // Registering _scheduler events.
      this._scheduler!.off("collect", this.collectEventCallback);
      this._scheduler!.off("publish", this.publishEventCallback);

      this._status = Status.STOPED;
    } catch (e: any) {
      PrintError(e);
      throw new Error(ErrorCodes.TASK_CANNOT_BE_STOPPED);
    }
  }

  private collectEventCallback() {
    this._metricCollectors.forEach((mc: AbstractMetricCollector) => {
      mc.collect().then((data: MetricData | MetricData[]) => {
        this._collectedData.add(data);
      });
    });
  }

  private publishEventCallback() {
    this._collectedData.merge().then(() => {
      this._publisher!.publish(this._collectedData.getItems());
    });
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
    if (this._scheduler === null) {
      throw new Error(ErrorCodes.SCHEDULER_NOT_DEFINED);
    }
    if (this._publisher === null) {
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
    if (this._scheduler === null) {
      throw new Error(ErrorCodes.SCHEDULER_NOT_DEFINED);
    }
    if (this._publisher === null) {
      throw new Error(ErrorCodes.PUBLISHER_NOT_DEFINED);
    }
  }
}
