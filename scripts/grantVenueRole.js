const hre = require("hardhat");

async function main() {
  const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20";
  const venueAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const TicketToken = await hre.ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.attach(contractAddress);

  console.log(`Granting VENUE_ROLE to ${venueAddress}...`);
  const tx = await ticketToken.connect(deployer).grantVenueRole(venueAddress);
  await tx.wait();

  console.log(`VENUE_ROLE granted to ${venueAddress}! Transaction hash:`, tx.hash);

  const hasVenueRole = await ticketToken.hasRole(hre.ethers.id("VENUE_ROLE"), venueAddress);
  console.log(`Does ${venueAddress} have VENUE_ROLE?`, hasVenueRole);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });