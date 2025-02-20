"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCodes;
(function (ErrorCodes) {
    // Storage Class Related Errors
    ErrorCodes["ITEM_ALREADY_EXIST"] = "The item already exist.";
    ErrorCodes["ITEM_NOT_FOUND"] = "The item is not found.";
    // Task Class Related Errors
    ErrorCodes["TASK_ALREADY_STARTED"] = "The task is already started.";
    ErrorCodes["TASK_ALREADY_STOPPED"] = "The task is already stopped.";
    ErrorCodes["TASK_CANNOT_BE_STARTED"] = "Task cannot be started.";
    ErrorCodes["TASK_CANNOT_BE_STOPPED"] = "Task cannot be stopped.";
    ErrorCodes["SCHEDULER_NOT_DEFINED"] = "The scheduler is not defined.";
    ErrorCodes["PUBLISHER_NOT_DEFINED"] = "The publisher is not defined.";
    // General
    ErrorCodes["CANNOT_INITIALIZE_ABSTRACT_CLASSES"] = "You cannot initialize abstract classes.";
})(ErrorCodes || (ErrorCodes = {}));
exports.default = ErrorCodes;
