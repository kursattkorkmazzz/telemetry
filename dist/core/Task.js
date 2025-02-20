"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Status_js_1 = __importDefault(require("./enums/Status.js"));
const MetricDataStorage_js_1 = __importDefault(require("./libs/storage/MetricDataStorage.js"));
const Storage_js_1 = __importDefault(require("./libs/storage/Storage.js"));
const ErrorCodes_js_1 = __importDefault(require("./utils/errors/ErrorCodes.js"));
const PrintError_js_1 = __importDefault(require("./utils/errors/PrintError.js"));
const PrintConsolePublisher_js_1 = __importDefault(require("../publishers/PrintConsolePublisher.js"));
const IntervalScheduler_js_1 = __importDefault(require("../schedulers/IntervalScheduler.js"));
class Task {
    _name;
    _status;
    _metricCollectors;
    _scheduler;
    _publisher;
    _collectedData = new MetricDataStorage_js_1.default();
    constructor(name) {
        this._name = name;
        this._metricCollectors = new Storage_js_1.default();
        this._scheduler = new IntervalScheduler_js_1.default({
            collectIntervalInMS: 3000,
            publishIntervalInMS: 5000,
        });
        this._publisher = new PrintConsolePublisher_js_1.default();
        this._status = Status_js_1.default.STOPED;
        this._collectedData.removeAll();
    }
    metricCollector(mcClass, ...args) {
        const mcInstance = new mcClass(...args);
        this._metricCollectors.add(mcInstance);
        return this;
    }
    scheduler(schedulerClass, ...args) {
        this._scheduler = new schedulerClass(...args);
        return this;
    }
    publisher(publisherClass, ...args) {
        this._publisher = new publisherClass(...args);
        return this;
    }
    async start() {
        try {
            // If not an error which means it meet conditions to start.
            this.checkStartCondition();
            // We check _scheduler is defined at checkStartCondition function.
            this._scheduler.start();
            // Registering _scheduler events.WW
            this._scheduler.on("collect", () => this.collectEventCallback());
            this._scheduler.on("publish", () => this.publishEventCallback());
            this._status = Status_js_1.default.STARTED;
        }
        catch (e) {
            (0, PrintError_js_1.default)(e);
            throw new Error(ErrorCodes_js_1.default.TASK_CANNOT_BE_STARTED);
        }
    }
    async stop() {
        try {
            // If not an error which means it meet conditions to start.
            this.checkStopCondition();
            // We check _scheduler is defined at checkStartCondition function.
            this._scheduler.stop();
            // Registering _scheduler events.
            this._scheduler.off("collect", this.collectEventCallback);
            this._scheduler.off("publish", this.publishEventCallback);
            this._status = Status_js_1.default.STOPED;
        }
        catch (e) {
            (0, PrintError_js_1.default)(e);
            throw new Error(ErrorCodes_js_1.default.TASK_CANNOT_BE_STOPPED);
        }
    }
    collectEventCallback() {
        this._metricCollectors.forEach((mc) => {
            mc.collect().then((data) => {
                this._collectedData.add(data);
            });
        });
    }
    publishEventCallback() {
        this._collectedData.merge().then(() => {
            this._publisher.publish(this._collectedData.getItems());
        });
    }
    /**
     * Checks if the task can be started by verifying its current status and dependencies.
     *
     * @throws {Error} If the task has already been started.
     * @throws {Error} If the scheduler is not defined.
     * @throws {Error} If the publisher is not defined.
     */
    checkStartCondition() {
        if (this._status === Status_js_1.default.STARTED) {
            throw new Error(ErrorCodes_js_1.default.TASK_ALREADY_STARTED);
        }
        if (this._scheduler === null) {
            throw new Error(ErrorCodes_js_1.default.SCHEDULER_NOT_DEFINED);
        }
        if (this._publisher === null) {
            throw new Error(ErrorCodes_js_1.default.PUBLISHER_NOT_DEFINED);
        }
    }
    /**
     * Checks if the task can be stoped by verifying its current status and dependencies.
     *
     * @throws {Error} If the task has already been stoped.
     * @throws {Error} If the scheduler is not defined.
     * @throws {Error} If the publisher is not defined.
     */
    checkStopCondition() {
        if (this._status === Status_js_1.default.STOPED) {
            throw new Error(ErrorCodes_js_1.default.TASK_ALREADY_STOPPED);
        }
        if (this._scheduler === null) {
            throw new Error(ErrorCodes_js_1.default.SCHEDULER_NOT_DEFINED);
        }
        if (this._publisher === null) {
            throw new Error(ErrorCodes_js_1.default.PUBLISHER_NOT_DEFINED);
        }
    }
    getName() {
        return this._name;
    }
}
exports.default = Task;
