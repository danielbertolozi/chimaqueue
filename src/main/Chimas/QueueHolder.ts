import Queue from "./Queue";

export default class QueueHolder {
  private queues: Queue[] = [];

  public create(name: string) {
    if (!!this.findQueue(name)) {
      throw new Error("Queue already exists");
    }
    this.queues.push(new Queue(name));
  }

  private findQueue(name: string) {
    return this.queues.find((q) => q.getName() === name);
  }

  public get(name: string) {
    const queue = this.findQueue(name);
    if (!queue) {
      throw new Error("Queue does not exist. Use /new to start a new queue.");
    }
    return queue;
  }
}