const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TicketToken = await hre.ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy(deployer.address);
  await ticketToken.waitForDeployment();

  console.log("TicketToken deployed to:", ticketToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});