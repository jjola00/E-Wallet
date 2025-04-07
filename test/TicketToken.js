const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketToken", function () {
  let TicketToken, ticketToken, owner, venue, attendee;

  beforeEach(async function () {
    [owner, venue, attendee] = await ethers.getSigners();
    TicketToken = await ethers.getContractFactory("TicketToken");
    ticketToken = await TicketToken.deploy();
    await ticketToken.waitForDeployment();
  });

  it("should deploy with the correct name and symbol", async function () {
    expect(await ticketToken.name()).to.equal("TicketToken");
    expect(await ticketToken.symbol()).to.equal("TKT");
  });

  it("should allow the owner to grant venue role", async function () {
    await ticketToken.grantVenueRole(venue.address);
    expect(await ticketToken.hasRole(ethers.id("VENUE_ROLE"), venue.address)).to.be.true;
  });

  it("should allow venues to mint tickets", async function () {
    await ticketToken.grantVenueRole(venue.address);
    const amount = ethers.parseEther("100");
    await ticketToken.connect(venue).mint(attendee.address, amount);
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(amount);
  });

  it("should allow attendees to transfer tickets", async function () {
    await ticketToken.grantVenueRole(venue.address);
    const amount = ethers.parseEther("100");
    await ticketToken.connect(venue).mint(attendee.address, amount);

    const transferAmount = ethers.parseEther("50");
    await ticketToken.connect(attendee).transferTickets(owner.address, transferAmount);
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(ethers.parseEther("50"));
    expect(await ticketToken.balanceOf(owner.address)).to.equal(transferAmount);
  });

  it("should allow anyone to check balances", async function () {
    await ticketToken.grantVenueRole(venue.address);
    const amount = ethers.parseEther("100");
    await ticketToken.connect(venue).mint(attendee.address, amount);
    expect(await ticketToken.checkBalance(attendee.address)).to.equal(amount);
  });

  it("should return the correct total supply", async function () {
    await ticketToken.grantVenueRole(venue.address);
    const amount = ethers.parseEther("100");
    await ticketToken.connect(venue).mint(attendee.address, amount);
    expect(await ticketToken.getTotalSupply()).to.equal(amount);
  });

  it("should restrict minting to venues only", async function () {
    const amount = ethers.parseEther("100");
    // Use the custom error matcher for AccessControlUnauthorizedAccount
    await expect(
      ticketToken.connect(attendee).mint(attendee.address, amount)
    ).to.be.revertedWithCustomError(
      ticketToken,
      "AccessControlUnauthorizedAccount"
    ).withArgs(
      attendee.address,
      ethers.id("VENUE_ROLE")
    );
  });
});