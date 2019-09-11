import { expect } from "chai";
import QueueHolder from "../../main/Chimas/QueueHolder";
import Queue from "../../main/Chimas/Queue";

let holder: QueueHolder;
const name = "sampleName";
context("Queue Holder", () => {
  beforeEach(() => {
    holder = new QueueHolder();
  });
  describe("when calling function create", () => {
    it("should create a queue", () => {
      holder.create(name);
      expect(holder.get(name)).to.be.an.instanceOf(Queue);
    });
    it("should throw if queue already exists", () => {
      holder.create(name);
      expect(() => holder.create(name)).to.throw();
    });
  });
});