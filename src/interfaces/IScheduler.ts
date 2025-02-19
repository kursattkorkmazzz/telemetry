import EventEmitter from "events";
import Status from "../enums/Status.js";

export default interface IScheduler extends EventEmitter {
  status: Status;
  start(): void;
  stop(): void;
}
