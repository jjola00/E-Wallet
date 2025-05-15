const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Define the vendor address (use a pre-funded wallet address you control)
  const vendorAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273"; // Replace with your preferred vendor address

  const TicketToken = await ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy(vendorAddress);
  await ticketToken.waitForDeployment();

  console.log("TicketToken deployed to:", ticketToken.target);

  // Grant VENUE_ROLE to the vendor (optional, depending on your setup)
  console.log(`Granting VENUE_ROLE to ${vendorAddress}...`);
  const tx = await ticketToken.connect(deployer).grantVenueRole(vendorAddress);
  await tx.wait();
  console.log(`VENUE_ROLE granted to ${vendorAddress}! Transaction hash:`, tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });