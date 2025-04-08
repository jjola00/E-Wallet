// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TicketToken is ERC20, AccessControl {
    bytes32 public constant VENUE_ROLE = keccak256("VENUE_ROLE");
    uint256 public constant TICKET_PRICE = 0.01 ether; // Price per ticket in ETH

    constructor() ERC20("TicketToken", "TKT") {
        // Replace _setupRole with grantRole
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantVenueRole(address venue) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VENUE_ROLE, venue);
    }

    function mint(address to, uint256 amount) public onlyRole(VENUE_ROLE) {
        _mint(to, amount);
    }

    // New function to buy tickets
    function buyTickets(uint256 numberOfTickets) public payable {
        require(hasRole(VENUE_ROLE, msg.sender), "Caller is not a venue");
        uint256 totalCost = numberOfTickets * TICKET_PRICE;
        require(msg.value >= totalCost, "Insufficient ETH sent");

        // Mint tickets (1 ticket = 1 TKT token)
        _mint(msg.sender, numberOfTickets * 10**18); // Adjust for 18 decimals

        // Refund excess ETH if any
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function transferTickets(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }

    function checkBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}