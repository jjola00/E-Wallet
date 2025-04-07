// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TicketToken is ERC20, AccessControl {
    bytes32 public constant VENUE_ROLE = keccak256("VENUE_ROLE");

    event TicketsMinted(address indexed venue, address indexed to, uint256 amount);
    event TicketsTransferred(address indexed from, address indexed to, uint256 amount);

    constructor() ERC20("TicketToken", "TKT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VENUE_ROLE, msg.sender);
    }

    // Function to mint tickets (restricted to venues)
    function mint(address to, uint256 amount) public onlyRole(VENUE_ROLE) {
        _mint(to, amount);
        emit TicketsMinted(msg.sender, to, amount);
    }

    // Function to transfer tickets (available to anyone with tokens)
    function transferTickets(address to, uint256 amount) public {
        transfer(to, amount);
        emit TicketsTransferred(msg.sender, to, amount);
    }

    // Function to check ticket balance (available to anyone)
    function checkBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    // Function to get total supply of tickets (useful for venues)
    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    // Function to grant venue role to an address (restricted to admin)
    function grantVenueRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VENUE_ROLE, account);
    }

    // Override decimals to match the front-end (18 decimals by default in ERC-20)
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}