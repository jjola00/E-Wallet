const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Ticketing = await hre.ethers.getContractFactory("Ticketing");
    
    // Deploy the contract
    console.log("Deploying Ticketing contract...");
    const ticketing = await Ticketing.deploy();
    await ticketing.deployed();
    
    console.log("Ticketing contract deployed to:", ticketing.address);
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });