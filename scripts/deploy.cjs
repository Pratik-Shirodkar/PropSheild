const hre = require("hardhat");

async function main() {
    console.log("Deploying PropShieldLending...");

    const propShield = await hre.ethers.deployContract("PropShieldLending");

    await propShield.waitForDeployment();

    console.log(
        `PropShieldLending deployed to ${propShield.target}`
    );

    console.log("----------------------------------------------------");
    console.log("NEXT STEPS:");
    console.log("1. Update your frontend NEXT_PUBLIC_CONTRACT_ADDRESS with: " + propShield.target);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
