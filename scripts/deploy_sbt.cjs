const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const lendingContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!lendingContractAddress) {
        console.error("❌ Error: NEXT_PUBLIC_CONTRACT_ADDRESS is missing in .env");
        process.exit(1);
    }

    console.log("🚀 Deploying PropShieldSBT...");
    console.log("🔗 Linking to Lending Contract:", lendingContractAddress);

    const PropShieldSBT = await hre.ethers.getContractFactory("PropShieldSBT");
    const sbt = await PropShieldSBT.deploy(lendingContractAddress);

    await sbt.waitForDeployment();
    const address = await sbt.getAddress();

    console.log("✅ PropShieldSBT deployed to:", address);
    console.log("👉 Add this to your .env as NEXT_PUBLIC_SBT_CONTRACT_ADDRESS");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
