export default {
  identifyAction(command: string) {
    return command.split(" ")[1];
  }
}