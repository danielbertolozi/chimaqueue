import { expect } from "chai";
import SlackParser from "../../main/slack/SlackParser";

context("Slack Parser", () => {
  describe("when calling method identifyAction", () => {
    it("Should return the action coming from the command", () => {
      expect(SlackParser.identifyAction("/chimas new")).to.be.equal("new");
      expect(SlackParser.identifyAction("/chimas join")).to.be.equal("join");
      expect(SlackParser.identifyAction("/chimas next")).to.be.equal("next");
      expect(SlackParser.identifyAction("/chimas who")).to.be.equal("who");
    });
  });
});