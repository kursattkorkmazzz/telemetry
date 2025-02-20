import Task from "./core/Task";
export default class TelemetryAS {
    private tasks;
    constructor();
    /**
     * Creates a new task with the given name and adds it to the task list.
     *
     * @param taskName - The name of the task to be created.
     * @returns The newly created task.
     * @throws Will throw an error if the task creation fails.
     */
    createTask(taskName: string): Task;
    /**
     * Clears all tasks from the tasks list.
     *
     * This method removes all tasks from the `tasks` collection,
     * effectively resetting it to an empty state.
     */
    clearTasks(): void;
}
