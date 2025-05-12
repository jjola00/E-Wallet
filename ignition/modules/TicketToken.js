const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TicketTokenModule", (m) => {
  const venueAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273"; 
  const ticketToken = m.contract("TicketToken", [venueAddress]);

  return { ticketToken };
});