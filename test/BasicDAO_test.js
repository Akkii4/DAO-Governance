const { expect } = require("chai");

describe("BasicDAO", function () {
  let BasicDAO;
  let basicDAO;
  let owner;
  let member1;
  let member2;
  let nonMember;

  beforeEach(async () => {
    [owner, member1, member2, nonMember] = await ethers.getSigners();

    BasicDAO = await ethers.getContractFactory("BasicDAO");
    basicDAO = await BasicDAO.deploy();

    await basicDAO.addNewMember(member1.address);
    await basicDAO.addNewMember(member2.address);
  });

  describe("addNewMember()", function () {
    it("should add a new member to the DAO", async function () {
      await basicDAO.addNewMember(nonMember.address);
      const memberInfo = await basicDAO.memberInfo(nonMember.address);

      expect(memberInfo.memberAddress).to.equal(nonMember.address);
      expect(memberInfo.memberSince).to.be.above(0);
      expect(memberInfo.tokenBalance).to.equal(100);
      expect(await basicDAO.balances(nonMember.address)).to.equal(100);
      expect(await basicDAO.totalSupply()).to.equal(300);
      expect(await basicDAO.members(2)).to.equal(nonMember.address);
    });

    it("should revert if the member already exists", async function () {
      await expect(basicDAO.addNewMember(member1.address)).to.be.revertedWith(
        "Member already exists"
      );
    });
  });

  describe("removeMember()", function () {
    it("should remove a member from the DAO", async function () {
      await basicDAO.removeMember(member1.address);

      const memberInfo = await basicDAO.memberInfo(member1.address);
      expect(memberInfo.memberAddress).to.equal(ethers.constants.AddressZero);
      expect(memberInfo.memberSince).to.equal(0);
      expect(memberInfo.tokenBalance).to.equal(0);
      expect(await basicDAO.balances(member1.address)).to.equal(0);
      expect(await basicDAO.totalSupply()).to.equal(100);
      expect(await basicDAO.members(0)).to.equal(member2.address);
    });

    it("should revert if the member does not exist", async function () {
      await expect(basicDAO.removeMember(nonMember.address)).to.be.revertedWith(
        "Member does not exist"
      );
    });
  });

  describe("createNewProposal()", function () {
    it("should create a new proposal", async function () {
      const description = "Test proposal";
      await basicDAO.createNewProposal(description);

      const proposal = await basicDAO.proposals(0);
      expect(proposal.description).to.equal(description);
      expect(proposal.voteCount).to.equal(0);
      expect(proposal.executed).to.be.false;
    });
  });

  describe("castVote()", function () {
    it("should allow a member to vote for a proposal", async function () {
      await basicDAO.createNewProposal("Test proposal");
      await basicDAO.connect(member1).castVote(0, 50);

      expect(await basicDAO.votes(member1.address, 0)).to.be.true;
      const memberInfo = await basicDAO.memberInfo(member1.address);
      expect(memberInfo.tokenBalance).to.equal(50);
      const proposals = await basicDAO.proposals(0);
      expect(proposals.voteCount).to.equal(50);
      expect(await basicDAO.totalSupply()).to.equal(200);
    });

    it("should revert if the voter is not a member", async function () {
      await expect(
        basicDAO.connect(nonMember).castVote(0, 50)
      ).to.be.revertedWith("Only members can vote");
    });

    it("should revert if the voter does not have enough tokens", async function () {
      await expect(basicDAO.connect(member1).castVote(0, 150)).to.be.reverted;
    });

    it("should revert if the voter has already voted for the proposal", async function () {
      await basicDAO.createNewProposal("Test proposal");
      basicDAO.connect(member1).castVote(0, 50);

      await expect(basicDAO.connect(member1).castVote(0, 50)).to.be.reverted;
    });
  });

  describe("executeProposal()", function () {
    it("should execute a proposal", async function () {
      await basicDAO.createNewProposal("Test proposal");
      await basicDAO.connect(member1).castVote(0, 70);
      await basicDAO.connect(member2).castVote(0, 70);
      await basicDAO.executeProposal(0);
      const proposals = await basicDAO.proposals(0);
      expect(proposals.executed).to.equal(true);
    });

    it("should revert if the proposal has already been executed", async function () {
      await basicDAO.createNewProposal("(Test proposal)");
      await basicDAO.connect(member1).castVote(0, 70);
      await basicDAO.connect(member2).castVote(0, 70);
      await basicDAO.executeProposal(0);

      await expect(basicDAO.executeProposal(0)).to.be.revertedWith(
        "Proposal already executed"
      );
    });

    it("should revert if the proposal does not have enough votes", async function () {
      await basicDAO.createNewProposal("Test proposal");
      await basicDAO.connect(member1).castVote(0, 50);

      await expect(basicDAO.executeProposal(0)).to.be.revertedWith(
        "Not enough votes"
      );
    });
  });
});
