const hre = require("hardhat");

async function main() {
    console.log("Deploying Ticketing contract...");
    const Ticketing = await hre.ethers.getContractFactory("Ticketing");
    const ticketing = await Ticketing.deploy();
    
    console.log("Waiting for deployment to complete...");
    await ticketing.waitForDeployment();
    
    console.log("Ticketing contract deployed to:", ticketing.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });