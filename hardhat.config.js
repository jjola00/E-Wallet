require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_PROJECT_ID || "https://sepolia.infura.io/v3/11c85e7f82d54484a04d55fc3d502cb2", // Use Infura URL
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};