import AbstractScheduler from "../../core/abstracts/AbstractScheduler";
import Status from "../../core/enums/Status";
export default class IntervalScheduler extends AbstractScheduler {
    status: Status;
    private collectEventTimer;
    private publishEventTimer;
    private collectIntervalInMS;
    private publishIntervalInMS;
    constructor(opts: {
        collectIntervalInMS: number;
        publishIntervalInMS: number;
    });
    start(): void;
    stop(): void;
}
