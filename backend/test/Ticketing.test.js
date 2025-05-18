const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ticketing Contract", function () {
    let Ticketing, ticketing, owner, addr1, addr2;

    beforeEach(async function () {
        Ticketing = await ethers.getContractFactory("Ticketing");
        [owner, addr1, addr2] = await ethers.getSigners();
        ticketing = await Ticketing.deploy();
    });

    it("Should have correct ticket price", async function () {
        const ticketPrice = await ticketing.TICKET_PRICE();
        expect(ticketPrice).to.equal(ethers.parseEther("0.01"));
    });

    it("Should allow buying tickets", async function () {
        await expect(
            ticketing.buyTickets(2, { value: ethers.parseEther("0.02") })
        ).to.emit(ticketing, "TicketsBought")
            .withArgs(owner.address, 2);

        const balance = await ticketing.checkBalance(owner.address);
        expect(balance).to.equal(ethers.parseEther("2"));
    });

    it("Should refund excess ETH when buying tickets", async function () {
        const initialBalance = await ethers.provider.getBalance(owner.address);
        
        const tx = await ticketing.buyTickets(2, { 
            value: ethers.parseEther("0.03") 
        });
        
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed * tx.gasPrice;
        
        const finalBalance = await ethers.provider.getBalance(owner.address);
        const expectedBalance = initialBalance - ethers.parseEther("0.02") - gasUsed;
        
        // Allow for a small difference due to calculation precision
        const diff = finalBalance > expectedBalance ? 
            finalBalance - expectedBalance : expectedBalance - finalBalance;
        expect(diff < ethers.parseEther("0.0001")).to.be.true;
    });

    it("Should allow transferring tickets", async function () {
        await ticketing.buyTickets(2, { value: ethers.parseEther("0.02") });
        
        await expect(
            ticketing.transferTickets(addr1.address, ethers.parseEther("1"))
        ).to.emit(ticketing, "TicketsTransferred")
            .withArgs(owner.address, addr1.address, 1);
        
        expect(await ticketing.checkBalance(owner.address)).to.equal(ethers.parseEther("1"));
        expect(await ticketing.checkBalance(addr1.address)).to.equal(ethers.parseEther("1"));
    });

    it("Should fail when transferring more tickets than owned", async function () {
        await ticketing.buyTickets(1, { value: ethers.parseEther("0.01") });
        
        await expect(
            ticketing.transferTickets(addr1.address, ethers.parseEther("2"))
        ).to.be.revertedWith("Insufficient ticket balance");
    });

    it("Should fail if insufficient ETH sent", async function () {
        await expect(
            ticketing.buyTickets(2, { value: ethers.parseEther("0.01") })
        ).to.be.revertedWith("Insufficient Ether sent");
    });

    it("Should fail when buying zero tickets", async function () {
        await expect(
            ticketing.buyTickets(0, { value: ethers.parseEther("0") })
        ).to.be.revertedWith("Must buy at least one ticket");
    });

    it("Should fail when transferring to zero address", async function () {
        await ticketing.buyTickets(1, { value: ethers.parseEther("0.01") });
        
        await expect(
            ticketing.transferTickets(ethers.ZeroAddress, ethers.parseEther("1"))
        ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should track contract balance correctly", async function () {
        expect(await ticketing.getContractBalance()).to.equal(0);
        
        await ticketing.buyTickets(2, { value: ethers.parseEther("0.02") });
        
        expect(await ticketing.getContractBalance()).to.equal(ethers.parseEther("0.02"));
    });
});