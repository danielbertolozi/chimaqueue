import Queue from "../../src/Chimas/Queue";
import { expect } from "chai";

let queue: Queue;
const name = "sampleName";
context("Queue", () => {
  beforeEach(() => {
    queue = new Queue(name);
  });
  describe("when calling function getName", () => {
    it("should return the queue name", () => {
      expect(queue.getName()).to.be.equal(name);
    });
  });
  describe("when calling function add", () => {
    it("should add a person to the queue", () => {
      queue.add("joao");
      expect(queue.getGuestList()).to.have.length(1);
    });
  });
  describe("when calling function remove", () => {
    it("should remove person from queue", () => {
      queue.add("joao");
      expect(queue.getGuestList()).to.have.length(1);
      queue.remove("joao");
      expect(queue.getGuestList()).to.have.length(0);
    });
  });
});