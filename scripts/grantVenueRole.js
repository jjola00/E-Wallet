const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Granting role with account:", deployer.address);

    const contractAddress = "0x50fc3AfE680CecfBd81c75487f5c80Ebf05eF668";
    const vendorAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273";

    const TicketToken = await ethers.getContractFactory("TicketToken");
    const ticketToken = TicketToken.attach(contractAddress);

    console.log(`Granting VENUE_ROLE to ${vendorAddress}...`);
    const tx = await ticketToken.connect(deployer).grantVenueRole(vendorAddress);
    await tx.wait();
    console.log(`VENUE_ROLE granted! Transaction hash: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error granting role:", error);
        process.exit(1);
    });