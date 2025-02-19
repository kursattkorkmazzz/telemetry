import Status from "./enums/Status.js";
import IMetricCollector from "./interfaces/IMetricCollector.js";
import IPublisher from "./interfaces/IPublisher.js";
import IScheduler from "./interfaces/IScheduler.js";
import MetricDataStorage from "./libs/storage/MetricDataStorage.js";
import Storage from "./libs/storage/Storage.js";
import MetricData from "./types/MetricData.js";
import ErrorCodes from "./utils/errors/ErrorCodes.js";
import PrintError from "./utils/errors/PrintError.js";

export default class Task {
  private _status: Status;
  private _metricCollectors: Storage<IMetricCollector>;
  private _scheduler: IScheduler | null;
  private _publisher: IPublisher | null;

  private _collectedData = new MetricDataStorage();

  constructor() {
    this._metricCollectors = new Storage<IMetricCollector>();
    this._scheduler = null;
    this._publisher = null;
    this._status = Status.STOPED;
    this._collectedData.removeAll();
  }

  public metricCollector(mcClass: new () => IMetricCollector) {
    const mcInstance = new mcClass();
    this._metricCollectors.add(mcInstance);
    return this;
  }

  public scheduler(schedulerClass: new () => IScheduler) {
    this._scheduler = new schedulerClass();
    return this;
  }

  public publisher(publisherClass: new () => IPublisher) {
    this._publisher = new publisherClass();
    return this;
  }

  public start() {
    try {
      // If not an error which means it meet conditions to start.
      this.checkStartCondition();

      // We check _scheduler is defined at checkStartCondition function.
      this._scheduler!.start();
      // Registering _scheduler events.
      this._scheduler!.on("collect", this.collectEventCallback);
      this._scheduler!.on("publish", this.publishEventCallback);

      this._status = Status.STARTED;
    } catch (e: any) {
      PrintError(e);
      throw new Error(ErrorCodes.TASK_CANNOT_BE_STARTED);
    }
  }

  public stop() {
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

  public collectEventCallback() {
    this._metricCollectors.forEach((mc: IMetricCollector) => {
      mc.collect().then((data: MetricData | MetricData[]) => {
        this._collectedData.add(data);
      });
    });
  }

  public publishEventCallback() {
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
