// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Ticketing {
    // Ticket price in wei (1 ether = 10^18 wei)
    uint256 public constant TICKET_PRICE = 0.01 ether;

    // Mapping to store ticket balances for each address
    mapping(address => uint256) private balances;

    // Event emitted when tickets are bought
    event TicketsBought(address indexed buyer, uint256 numberOfTickets);

    // Event emitted when tickets are transferred
    event TicketsTransferred(address indexed from, address indexed to, uint256 numberOfTickets);

    // Function to buy tickets
    function buyTickets(uint256 numberOfTickets) public payable {
        require(numberOfTickets > 0, "Must buy at least one ticket");
        uint256 totalCost = numberOfTickets * TICKET_PRICE;
        require(msg.value >= totalCost, "Insufficient Ether sent");

        // Update balance (1 ticket = 1 ether for simplicity in frontend conversion)
        balances[msg.sender] += numberOfTickets * 1 ether;

        // Refund excess Ether
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit TicketsBought(msg.sender, numberOfTickets);
    }

    // Function to check balance of an address
    function checkBalance(address account) public view returns (uint256) {
        return balances[account];
    }

    // Function to transfer tickets to another address
    function transferTickets(address to, uint256 amount) public {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Must transfer at least one ticket");
        require(balances[msg.sender] >= amount, "Insufficient ticket balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit TicketsTransferred(msg.sender, to, amount / 1 ether);
    }

    // Function to get contract's Ether balance (for admin purposes, optional)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}