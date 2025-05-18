const { expect } = require("chai");

describe("Ticketing Contract", function () {
    let Ticketing, ticketing, owner, addr1;

    beforeEach(async function () {
        Ticketing = await ethers.getContractFactory("Ticketing");
        [owner, addr1] = await ethers.getSigners();
        ticketing = await Ticketing.deploy();
        await ticketing.deployed();
    });

    it("Should have correct ticket price", async function () {
        const ticketPrice = await ticketing.TICKET_PRICE();
        expect(ticketPrice).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("Should allow buying tickets", async function () {
        await ticketing.buyTickets(2, { value: ethers.utils.parseEther("0.02") });
        const balance = await ticketing.checkBalance(owner.address);
        expect(balance).to.equal(ethers.utils.parseEther("2"));
    });
});