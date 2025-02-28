import EventEmitter from "events";
import Status from "../enums/Status.js";

export abstract class AbstractScheduler extends EventEmitter {
  abstract status: Status;
  abstract start(): void;
  abstract stop(): void;
}
