const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log("Loaded Wallet Address:", wallet.address);

        const balance = await provider.getBalance(wallet.address);
        console.log("Balance (ETH):", ethers.formatEther(balance));

        const nonce = await provider.getTransactionCount(wallet.address);
        console.log("Nonce:", nonce);

        const feeData = await provider.getFeeData();
        console.log("Gas Price (Gwei):", ethers.formatUnits(feeData.gasPrice, "gwei"));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
