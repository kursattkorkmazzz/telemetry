"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = __importDefault(require("./core/libs/storage/Storage"));
const Task_1 = __importDefault(require("./core/Task"));
class TelemetryAS {
    tasks;
    constructor() {
        this.tasks = new Storage_1.default();
    }
    /**
     * Creates a new task with the given name and adds it to the task list.
     *
     * @param taskName - The name of the task to be created.
     * @returns The newly created task.
     * @throws Will throw an error if the task creation fails.
     */
    createTask(taskName) {
        try {
            const newTask = new Task_1.default(taskName);
            this.tasks.add(newTask);
            return newTask;
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Clears all tasks from the tasks list.
     *
     * This method removes all tasks from the `tasks` collection,
     * effectively resetting it to an empty state.
     */
    clearTasks() {
        this.tasks.removeAll();
    }
}
exports.default = TelemetryAS;
