// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// TicketToken is an ERC-20 token for event ticketing on the Sepolia Testnet.
contract TicketToken is ERC20, AccessControl {
    // Role identifier for venue administrators.
    bytes32 public constant VENUE_ROLE = keccak256("VENUE_ROLE");

    // Price per ticket in ETH (0.01 ETH).
    uint256 public constant TICKET_PRICE = 0.01 ether;

    // Address of the vendor for ticket returns.
    address public vendor;

    // Events for tracking ticket-related actions.
    event TicketsPurchased(address indexed buyer, uint256 amount);
    event TicketsReturned(address indexed returner, uint256 amount);
    event TicketScanned(address indexed account);

    // Constructor initializes the token and sets the deployer as admin.
    constructor(address _vendor) ERC20("TicketToken", "TKT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        vendor = _vendor;
    }

    // Grants the VENUE_ROLE to a specified address, restricted to admins.
    function grantVenueRole(address venue) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VENUE_ROLE, venue);
    }

    // Mints new tickets, restricted to venues.
    function mint(address to, uint256 amount) public onlyRole(VENUE_ROLE) {
        _mint(to, amount);
    }

    // Allows any user to buy tickets by sending ETH.
    function buyTickets(uint256 numberOfTickets) public payable {
        require(numberOfTickets > 0, "Must buy at least 1 ticket");
        uint256 totalCost = numberOfTickets * TICKET_PRICE;
        require(msg.value >= totalCost, "Insufficient ETH sent");

        // Mint tickets (1 ticket = 1 TKT token, adjusted for 18 decimals)
        _mint(msg.sender, numberOfTickets * 10**18);
        emit TicketsPurchased(msg.sender, numberOfTickets);

        // Refund excess ETH if any
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    // Allows users to return tickets to the vendor and receive a refund.
    function returnTickets(uint256 numberOfTickets) public {
        uint256 amount = numberOfTickets * 10**18;
        require(balanceOf(msg.sender) >= amount, "Insufficient ticket balance");
        uint256 refundAmount = numberOfTickets * TICKET_PRICE;
        require(address(this).balance >= refundAmount, "Contract has insufficient ETH");

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(refundAmount);
        emit TicketsReturned(msg.sender, numberOfTickets);
    }

    // Allows venues to scan and burn a ticket, used by doormen.
    function scanTicket(address account) public onlyRole(VENUE_ROLE) {
        require(balanceOf(account) >= 10**18, "No tickets to scan");
        _burn(account, 10**18);
        emit TicketScanned(account);
    }

    // Transfers tickets to another address (e.g., back to the vendor).
    function transferTickets(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }

    // Checks the ticket balance of an account.
    function checkBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    // Returns the total supply of tickets.
    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    // Allows the contract to receive ETH.
    receive() external payable {}
}