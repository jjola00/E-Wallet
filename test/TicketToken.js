const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TicketToken", function () {
  let TicketToken, ticketToken, owner, venue, attendee;

  beforeEach(async function () {
    [owner, venue, attendee] = await hre.ethers.getSigners();
    TicketToken = await hre.ethers.getContractFactory("TicketToken");
    ticketToken = await TicketToken.deploy(venue.address);
    await ticketToken.waitForDeployment();
  });

  it("should deploy with the correct name and symbol", async function () {
    expect(await ticketToken.name()).to.equal("TicketToken");
    expect(await ticketToken.symbol()).to.equal("TKT");
  });

  it("should allow the owner to grant venue role", async function () {
    await ticketToken.grantVenueRole(venue.address);
    expect(await ticketToken.hasRole(hre.ethers.id("VENUE_ROLE"), venue.address)).to.be.true;
  });

  it("should allow venues to mint tickets", async function () {
    const amount = hre.ethers.parseEther("100");
    await ticketToken.connect(venue).mint(attendee.address, amount);
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(amount);
  });

  it("should allow attendees to buy tickets", async function () {
    const numberOfTickets = 2;
    const totalCost = hre.ethers.parseEther("0.02");
    const tx = await ticketToken.connect(attendee).buyTickets(numberOfTickets, { value: totalCost });
    const balance = await ticketToken.balanceOf(attendee.address);
    expect(balance).to.equal(hre.ethers.parseEther("2"));
    await expect(tx).to.emit(ticketToken, "TicketPurchased").withArgs(attendee.address, 1, numberOfTickets);
  });

  it("should refund excess ETH when buying tickets", async function () {
    const numberOfTickets = 1;
    const sentValue = hre.ethers.parseEther("0.02");
    const expectedCost = hre.ethers.parseEther("0.01");
    const initialBalance = await hre.ethers.provider.getBalance(attendee.address);
    const tx = await ticketToken.connect(attendee).buyTickets(numberOfTickets, { value: sentValue });
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice; // Use BigInt arithmetic
    const finalBalance = await hre.ethers.provider.getBalance(attendee.address);

    const expectedBalance = initialBalance - gasUsed - expectedCost;

    expect(finalBalance).to.be.closeTo(expectedBalance, hre.ethers.parseEther("0.001"));
  });

  it("should allow attendees to transfer tickets", async function () {
    await ticketToken.connect(attendee).buyTickets(2, { value: hre.ethers.parseEther("0.02") });
    const amount = hre.ethers.parseEther("1");
    await ticketToken.connect(attendee).transferTickets(owner.address, amount, 1);
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(hre.ethers.parseEther("1"));
    expect(await ticketToken.balanceOf(owner.address)).to.equal(amount);
  });

  it("should allow transfer to vendor", async function () {
    await ticketToken.connect(attendee).buyTickets(2, { value: hre.ethers.parseEther("0.02") });
    const amount = hre.ethers.parseEther("1");
    await ticketToken.connect(attendee).transferToVendor(amount, 1);
    expect(await ticketToken.balanceOf(venue.address)).to.equal(amount);
  });

  it("should expire tickets after 30 days", async function () {
    await ticketToken.connect(attendee).buyTickets(1, { value: hre.ethers.parseEther("0.01") });
    await time.increase(31 * 24 * 60 * 60);
    await expect(ticketToken.connect(attendee).transferTickets(owner.address, hre.ethers.parseEther("1"), 1))
        .to.be.revertedWith("Ticket has expired");
    await ticketToken.connect(attendee).burnExpiredTicket(1);
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(0);
  });

  it("should allow pausing and unpausing", async function () {
    await ticketToken.pause();
    await expect(ticketToken.connect(attendee).buyTickets(1, { value: hre.ethers.parseEther("0.01") }))
        .to.be.revertedWithCustomError(ticketToken, "EnforcedPause");
    await ticketToken.unpause();
    await ticketToken.connect(attendee).buyTickets(1, { value: hre.ethers.parseEther("0.01") });
    expect(await ticketToken.balanceOf(attendee.address)).to.equal(hre.ethers.parseEther("1"));
  });

  it("should allow venue to withdraw ETH", async function () {
    await ticketToken.connect(attendee).buyTickets(1, { value: hre.ethers.parseEther("0.01") });
    const initialBalance = await hre.ethers.provider.getBalance(venue.address);
    const tx = await ticketToken.connect(venue).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice; // Use BigInt arithmetic
    const finalBalance = await hre.ethers.provider.getBalance(venue.address);

    const expectedBalance = initialBalance + hre.ethers.parseEther("0.01") - gasUsed;

    expect(finalBalance).to.be.closeTo(expectedBalance, hre.ethers.parseEther("0.001"));
  });
});