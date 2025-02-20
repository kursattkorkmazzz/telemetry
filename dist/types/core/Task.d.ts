import AbstractMetricCollector from "./abstracts/AbstractMetricCollector.js";
import AbstractPublisher from "./abstracts/AbstractPublisher.js";
import AbstractScheduler from "./abstracts/AbstractScheduler.js";
export default class Task {
    private _name;
    private _status;
    private _metricCollectors;
    private _scheduler;
    private _publisher;
    private _collectedData;
    constructor(name: string);
    metricCollector<T extends new (...args: any[]) => AbstractMetricCollector>(mcClass: T, ...args: ConstructorParameters<T>): this;
    scheduler<T extends new (...args: any[]) => AbstractScheduler>(schedulerClass: T, ...args: ConstructorParameters<T>): this;
    publisher<T extends new (...args: any[]) => AbstractPublisher>(publisherClass: T, ...args: ConstructorParameters<T>): this;
    start(): Promise<void>;
    stop(): Promise<void>;
    private collectEventCallback;
    private publishEventCallback;
    /**
     * Checks if the task can be started by verifying its current status and dependencies.
     *
     * @throws {Error} If the task has already been started.
     * @throws {Error} If the scheduler is not defined.
     * @throws {Error} If the publisher is not defined.
     */
    private checkStartCondition;
    /**
     * Checks if the task can be stoped by verifying its current status and dependencies.
     *
     * @throws {Error} If the task has already been stoped.
     * @throws {Error} If the scheduler is not defined.
     * @throws {Error} If the publisher is not defined.
     */
    private checkStopCondition;
    getName(): string;
}
