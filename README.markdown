# E-Wallet Ticketing Project

## Overview
This project implements a decentralized ticketing system using Ethereum smart contracts. Users can buy, check, and transfer tickets (TKT tokens) on the Sepolia Testnet.

## Project Structure
- `backend/`: Contains Solidity smart contracts and deployment scripts.
  - `contracts/Ticketing.sol`: The main smart contract.
  - `scripts/deploy.js`: Deployment script.
  - `hardhat.config.js`: Hardhat configuration.
- `frontend/`: Contains the web interface.
  - `checkBalance.html`, `buyTicket.html`, `transferTicket.html`: HTML pages.
  - `checkBalance.js`, `buyTicket.js`, `transferTicket.js`: JavaScript logic.
  - `style.css`: Styling.
- `report.md`: Project report.

## Smart Contract Details
- **Contract Address**: `0x1fB85B7616804E0AadF7D82f8DdE73EAb41E9309`
- **Network**: Sepolia Testnet
- **Holding Wallet**: `0x0CC682283632905d49F67e86d3e9c7aaA295C4c9` (used for testing)

## Prerequisites
1. **Node.js** and **npm**: Install from `https://nodejs.org/`.
2. **MetaMask**: Browser extension with an account funded with Sepolia ETH.
3. **Visual Studio Code**: With the Live Server plugin installed.
4. **Hardhat**: For contract compilation and deployment (optional if not redeploying).

## How to Run the Project
1. **Clone/Open the Project**:
   - Open the project folder (`E-Wallet`) in Visual Studio Code.

2. **Install Dependencies** (if redeploying the contract):
   - Open a terminal in VS Code.
   - Navigate to the `backend` folder: `cd backend`.
   - Install dependencies: `npm install`.

3. **Run the Frontend**:
   - In VS Code, open the `frontend` folder.
   - Right-click `checkBalance.html` (or any HTML file) and select "Open with Live Server" (requires Live Server plugin).
   - This will open the page in your browser at `http://127.0.0.1:5500/checkBalance.html`.
   - Alternatively, run a local server manually:
     - Navigate to `frontend`: `cd frontend`.
     - Start a server: `python -m http.server 8000`.
     - Open `http://127.0.0.1:8000/checkBalance.html`.

4. **Interact with the DApp**:
   - Ensure MetaMask is connected to the Sepolia Testnet.
   - Use the following pages:
     - `checkBalance.html`: Check TKT and SETH balances.
     - `buyTicket.html`: Buy tickets (requires SETH).
     - `transferTicket.html`: Transfer tickets to another address.

5. **Optional: Redeploy the Contract**:
   - In the `backend` folder, configure `hardhat.config.js` with your Sepolia RPC URL and private key.
   - Compile the contract: `npx hardhat compile`.
   - Deploy: `npx hardhat run scripts/deploy.js --network sepolia`.
   - Update the `contractAddress` in all `.js` files in the `frontend` folder with the new address.

## Notes
- The project assumes the contract is already deployed at the address above.
- Fund your MetaMask wallet with Sepolia ETH using a faucet like `https://sepoliafaucet.com/` to buy tickets.
- The contract uses 0.01 ETH per ticket.