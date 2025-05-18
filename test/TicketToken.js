const { expect } = require("chai");

describe("TicketToken", function () {
    let TicketToken, ticketToken, owner, addr1, vendor;

    beforeEach(async function () {
        [owner, addr1, vendor] = await ethers.getSigners();
        TicketToken = await ethers.getContractFactory("TicketToken");
        ticketToken = await TicketToken.deploy(vendor.address);
        await ticketToken.waitForDeployment();
    });

    it("Should allow buying tickets", async function () {
        await ticketToken.connect(addr1).buyTickets(1, { value: ethers.parseEther("0.01") });
        expect(await ticketToken.checkBalance(addr1.address)).to.equal(ethers.parseEther("1"));
    });

    it("Should allow returning tickets", async function () {
        await ticketToken.connect(addr1).buyTickets(1, { value: ethers.parseEther("0.01") });
        await ticketToken.connect(addr1).returnTickets(1);
        expect(await ticketToken.checkBalance(addr1.address)).to.equal(0);
    });

    it("Should allow scanning tickets by venue", async function () {
        await ticketToken.connect(addr1).buyTickets(1, { value: ethers.parseEther("0.01") });
        await ticketToken.connect(vendor).scanTicket(addr1.address);
        expect(await ticketToken.checkBalance(addr1.address)).to.equal(0);
    });

    it("Should fail transfer to non-vendor", async function () {
        await ticketToken.connect(addr1).buyTickets(1, { value: ethers.parseEther("0.01") });
        await expect(
            ticketToken.connect(addr1).transferTickets(addr1.address, ethers.parseEther("1"))
        ).to.be.revertedWith("Transfer failed");
    });
});