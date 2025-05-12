const hre = require("hardhat");

async function main() {
  const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20"; 
  const venueAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273";

  const TicketToken = await hre.ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.attach(contractAddress);

  const tx = await ticketToken.grantVenueRole(venueAddress);
  await tx.wait();

  console.log(`Venue role granted to ${venueAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});