const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Ticketing = await hre.ethers.getContractFactory("Ticketing");
    
    // Deploy the contract
    console.log("Deploying Ticketing contract...");
    const ticketing = await Ticketing.deploy(); // deploy() directly returns the deployed contract
    console.log("Waiting for deployment to complete...");
    await ticketing.waitForDeployment(); // Use waitForDeployment() to ensure the contract is fully deployed
    
    console.log("Ticketing contract deployed to:", await ticketing.getAddress());
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });