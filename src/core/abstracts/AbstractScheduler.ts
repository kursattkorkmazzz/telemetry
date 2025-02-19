import EventEmitter from "events";
import Status from "../enums/Status.js";

export default abstract class AbstractScheduler extends EventEmitter {
  abstract status: Status;
  abstract start(...args: any): void;
  abstract stop(...args: any): void;
}
