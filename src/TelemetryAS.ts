import Storage from "./core/libs/storage/Storage";
import Task from "./core/Task";

export default class TelemetryAS {
  private tasks: Storage<Task>;

  constructor() {
    this.tasks = new Storage<Task>();
  }

  /**
   * Creates a new task with the given name and adds it to the task list.
   *
   * @param taskName - The name of the task to be created.
   * @returns The newly created task.
   * @throws Will throw an error if the task creation fails.
   */
  public createTask(taskName: string): Task {
    try {
      const newTask = new Task(taskName);
      this.tasks.add(newTask);
      return newTask;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Clears all tasks from the tasks list.
   *
   * This method removes all tasks from the `tasks` collection,
   * effectively resetting it to an empty state.
   */
  public clearTasks(): void {
    this.tasks.removeAll();
  }
}
