const solc = require("solc");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    console.log("Starting Standalone Deployment...");

    // 1. Compile
    const contractPath = path.resolve(__dirname, "../contracts/PropShieldLending.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: {
            "PropShieldLending.sol": {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    console.log("Compiling...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        const errors = output.errors.filter(e => e.severity === 'error');
        if (errors.length > 0) {
            console.error("Compilation Errors:", output.errors);
            process.exit(1);
        }
    }

    const contractFile = output.contracts["PropShieldLending.sol"]["PropShieldLending"];
    const abi = contractFile.abi;
    const bytecode = contractFile.evm.bytecode.object;

    console.log("Compilation Successful!");

    // 2. Deploy
    // Using backup public RPC
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

    if (!process.env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY not found in .env");
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Deploying from address:", wallet.address);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy
    const contract = await factory.deploy();
    console.log("Transaction sent:", contract.deploymentTransaction().hash);

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("------------------------------------------------");
    console.log("DEPLOYMENT COMPLETE");
    console.log("Contract Address:", address);
    console.log("------------------------------------------------");

    // Save address for frontend?
    const configPath = path.resolve(__dirname, "../src/config/contract.json");
    // fs.writeFileSync(configPath, JSON.stringify({ address, abi }, null, 2));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
