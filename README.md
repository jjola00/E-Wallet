# Ticketing DApp

This is a decentralized ticketing application built on the Sepolia Testnet using Ethereum, Web3.js, and Solidity.

## Prerequisites
- Node.js and npm installed
- MetaMask configured with Sepolia Testnet (chainId: 11155111)
- Hardhat: `npm install --save-dev hardhat`
- Dependencies: `npm install @openzeppelin/contracts @nomicfoundation/hardhat-ignition ethers`

## Setup
1. Configure `hardhat.config.js` with your Sepolia RPC URL and private key:
   ```javascript
   module.exports = {
       solidity: "0.8.28",
       networks: {
           sepolia: {
               url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
               accounts: ["YOUR_PRIVATE_KEY"]
           }
       }
   };