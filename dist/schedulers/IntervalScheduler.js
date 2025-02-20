"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractScheduler_1 = __importDefault(require("../core/abstracts/AbstractScheduler"));
const Status_1 = __importDefault(require("../core/enums/Status"));
const ErrorCodes_1 = __importDefault(require("../core/utils/errors/ErrorCodes"));
class IntervalScheduler extends AbstractScheduler_1.default {
    status;
    collectEventTimer;
    publishEventTimer;
    collectIntervalInMS;
    publishIntervalInMS;
    constructor(opts) {
        super();
        this.collectIntervalInMS = opts.collectIntervalInMS;
        this.publishIntervalInMS = opts.publishIntervalInMS;
        this.status = Status_1.default.STOPED;
    }
    start() {
        if (this.status != Status_1.default.STOPED) {
            throw Error(ErrorCodes_1.default.TASK_ALREADY_STARTED);
        }
        // Preparing to collect delay
        const collectTimerCallback = () => {
            this.emit("collect");
            this.collectEventTimer = setTimeout(collectTimerCallback, this.collectIntervalInMS);
        };
        this.collectEventTimer = setTimeout(collectTimerCallback, this.collectIntervalInMS);
        // Preparing to publish delay
        const publishTimerCallback = () => {
            this.emit("publish");
            this.publishEventTimer = setTimeout(publishTimerCallback, this.publishIntervalInMS);
        };
        this.publishEventTimer = setTimeout(publishTimerCallback, this.publishIntervalInMS);
        this.status = Status_1.default.STARTED;
    }
    stop() {
        clearTimeout(this.publishEventTimer);
        clearTimeout(this.collectEventTimer);
        this.status = Status_1.default.STOPED;
    }
}
exports.default = IntervalScheduler;
