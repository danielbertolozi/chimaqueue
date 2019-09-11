import QueueHolder from "./QueueHolder";
import { SlackPayload } from "../../LocalDefinitions";

type Action = (channelName: string, userName: string) => string;
export default class Chimas {
  private queues: QueueHolder;
  private actionsMap: {[key in Actions]: Action}
  constructor() {
    this.queues = new QueueHolder();
    this.actionsMap = {
      [Actions.new]: this.newQueue.bind(this),
      [Actions.join]: this.join.bind(this),
      [Actions.leave]: this.leave.bind(this),
      [Actions.next]: this.next.bind(this),
      [Actions.who]: this.who.bind(this),
      [Actions.clear]: this.clear.bind(this),
      [Actions.help]: this.help.bind(this)
    }
  }

  public execute(action: string, payload: SlackPayload): string {
    if (!Actions[action]) {
      return "Action not available.";
    }
    const channelName = payload.channel_name;
    const userName = payload.user_name;
    return this.actionsMap[action](channelName, userName);
  }

  private join(channelName: string, userName: string): string {
    let message: string;
    try {
      this.queues.get(channelName).add(userName);
      message = `*${userName}* has joined the queue!`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private newQueue(channelName: string): string {
    let message: string;
    try {
      this.queues.create(channelName);
      message = `Queue started for channel ${channelName}! Prepare the chimas :chimas:`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private leave(channelName: string, userName: string): string {
    let message: string;
    try {
      this.queues.get(name).remove(userName);
      message = `User ${userName} has left the queue.`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private next(channelName: string): string {
    let message: string;
    try {
      const next = this.queues.get(channelName).whosNext();
      message = `The next in queue is *${next}*.`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private who(channelName: string): string {
    let message: string;
    try {
      const usersInQueue = this.queues.get(channelName).getGuestList().join(", ");
      message = `The following users are in this queue, in this order: ${usersInQueue}.`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private clear(channelName: string): string {
    let message: string;
    try {
      this.queues.get(channelName).clear();
      message = `The queue has been cleared!`;
    } catch (e) {
      message = e.message;
    }
    return message;
  }

  private help(): string {
    return "*ChimaQueue*\n" +
      "For usage help, access: https://github.com/danielbertolozi/chimaqueue.\n" +
      "Available Commands: `new, join, leave, next, who, clear.`";
  }
}

enum Actions {
  new = "new",
  join = "join",
  leave = "leave",
  next = "next",
  who = "who",
  clear = "clear",
  help = "help"
}