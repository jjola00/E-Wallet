const { expect } = require("chai");

describe("Ticketing Contract", function () {
    let Ticketing, ticketing, owner, addr1, addr2;

    beforeEach(async function () {
        Ticketing = await ethers.getContractFactory("Ticketing");
        [owner, addr1, addr2] = await ethers.getSigners();
        ticketing = await Ticketing.deploy();
        await ticketing.deployed();
    });

    it("Should have correct token metadata", async function () {
        expect(await ticketing.name()).to.equal("EventTicket");
        expect(await ticketing.symbol()).to.equal("TKT");
        expect(await ticketing.decimals()).to.equal(18);
    });

    it("Should have correct ticket price", async function () {
        const ticketPrice = await ticketing.TICKET_PRICE();
        expect(ticketPrice).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("Should allow buying tickets with SETH", async function () {
        await ticketing.buyTickets(2, { value: ethers.utils.parseEther("0.02") });
        const balance = await ticketing.balanceOf(owner.address);
        expect(balance).to.equal(ethers.utils.parseEther("2"));
        expect(await ticketing.totalSupply()).to.equal(ethers.utils.parseEther("2"));
    });

    it("Should allow transferring tickets", async function () {
        await ticketing.buyTickets(2, { value: ethers.utils.parseEther("0.02") });
        await ticketing.transfer(addr1.address, ethers.utils.parseEther("1"));
        expect(await ticketing.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1"));
        expect(await ticketing.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should allow approving and transferring from", async function () {
        await ticketing.buyTickets(2, { value: ethers.utils.parseEther("0.02") });
        await ticketing.approve(addr1.address, ethers.utils.parseEther("1"));
        expect(await ticketing.allowance(owner.address, addr1.address)).to.equal(ethers.utils.parseEther("1"));
        await ticketing.connect(addr1).transferFrom(owner.address, addr2.address, ethers.utils.parseEther("1"));
        expect(await ticketing.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1"));
        expect(await ticketing.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should fail if insufficient SETH sent", async function () {
        await expect(
            ticketing.buyTickets(2, { value: ethers.utils.parseEther("0.01") })
        ).to.be.revertedWith("Insufficient SETH sent");
    });
});