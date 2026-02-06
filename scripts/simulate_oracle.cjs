const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
    // 1. Setup
    // 1. Setup - Use a more reliable public RPC for Sepolia or rotate them
    // Try: https://rpc.sepolia.org, https://1rpc.io/sepolia, https://ethereum-sepolia-rpc.publicnode.com
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!contractAddress) {
        throw new Error("Missing NEXT_PUBLIC_CONTRACT_ADDRESS in .env");
    }

    // 2. Load ABI
    const abiPath = path.resolve(__dirname, "../src/config/PropShieldLending.json");
    const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

    // 3. Connect Contract
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log("Simulating Oracle Update...");
    console.log("Oracle (Me):", wallet.address);
    console.log("Target User:", "0x352350F4e84b6BB647CaeD43da5978D7EC6dbCcF"); // Hardcoded for demo/hackathon

    // 4. Send Transaction
    // updateCreditLine(borrower, income, score)
    // Values from REAL TEE computation: Income: 54000, Score: 100
    const tx = await contract.updateCreditLine(
        "0x352350F4e84b6BB647CaeD43da5978D7EC6dbCcF",
        54000,  // Real TEE computed value
        100     // Real TEE computed score (perfect - no late payments)
    );

    console.log("Transaction Sent:", tx.hash);
    console.log("Waiting for confirmation...");

    await tx.wait();
    console.log("✅ Oracle Update Confirmed!");
    console.log("Go to the Frontend now - you should see the Credit Limit Approved card appear.");
}

main().catch(console.error);
