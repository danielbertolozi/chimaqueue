import Queue from "../../main/Chimas/Queue";
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
    it("should throw if person already is in queue", () => {
      queue.add("joao");
      expect(() => queue.add("joao")).to.throw();
    });
  });
  describe("when calling function remove", () => {
    it("should remove person from queue", () => {
      queue.add("joao");
      expect(queue.getGuestList()).to.have.length(1);
      queue.remove("joao");
      expect(queue.getGuestList()).to.have.length(0);
    });
    it("should throw if person doesn't exist", () => {
      expect(() => queue.remove("joao")).to.throw();
    });
  });
  describe("when calling function whosNext", () => {
    beforeEach(() => {
      queue.add("joao");
      queue.add("daniel");
      queue.add("alexia");
    });
    it("should return next person in line, and always repeat", () => {
      expect(queue.whosNext()).to.be.equal("joao");
      expect(queue.whosNext()).to.be.equal("daniel");
      expect(queue.whosNext()).to.be.equal("alexia");
      expect(queue.whosNext()).to.be.equal("joao");
      expect(queue.whosNext()).to.be.equal("daniel");
      expect(queue.whosNext()).to.be.equal("alexia");
    });
  });
});