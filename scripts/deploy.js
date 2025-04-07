async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TicketToken = await ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy();
  await ticketToken.waitForDeployment();

  console.log("TicketToken deployed to:", ticketToken.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });