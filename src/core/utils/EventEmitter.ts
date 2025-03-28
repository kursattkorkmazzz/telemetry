type ListenerType = {
  name: string;
  callback: () => void;
};

export class EventEmitter {
  listeners: ListenerType[] = [];

  emit(eventName: string) {
    this.listeners
      .filter(({ name }) => name === eventName)
      .forEach(({ callback }) => {
        setTimeout(function () {
          callback();
        }, 0);
      });
  }

  on(name: string, callback: () => void) {
    if (typeof name === "string" && typeof callback === "function") {
      this.listeners.push({ name, callback });
    }
  }

  off(eventName: string, callback: () => void) {
    this.listeners = this.listeners.filter((listener) => {
      !(listener.name === eventName && listener.callback === callback);
    });
  }

  destroy() {
    this.listeners.length = 0;
  }
}
