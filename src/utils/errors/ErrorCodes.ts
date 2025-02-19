enum ErrorCodes {
  // Storage Class Related Errors
  ITEM_ALREADY_EXIST = "The item already exist.",
  ITEM_NOT_FOUND = "The item is not found.",

  // Task Class Related Errors
  TASK_ALREADY_STARTED = "The task is already started.",
  TASK_ALREADY_STOPPED = "The task is already stopped.",
  TASK_CANNOT_BE_STARTED = "Task cannot be started.",
  TASK_CANNOT_BE_STOPPED = "Task cannot be stopped.",
  SCHEDULER_NOT_DEFINED = "The scheduler is not defined.",
  PUBLISHER_NOT_DEFINED = "The publisher is not defined.",
}

export default ErrorCodes;
