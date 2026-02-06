const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    try {
        console.log("Connecting to Sepolia RPC...");
        // backup: https://rpc.sepolia.org
        const provider = new ethers.JsonRpcProvider("https://1rpc.io/sepolia");

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("Wallet:", wallet.address);

        // Get current nonce (next transaction nonce)
        const nonce = await provider.getTransactionCount(wallet.address);
        console.log("Current Nonce:", nonce);

        if (nonce === 0) {
            console.log("Nonce is 0, no transactions found.");
            return;
        }

        // The contract was deployed at the previous nonce (nonce - 1)
        const deployedAddress = ethers.getContractAddress({
            from: wallet.address,
            nonce: nonce - 1
        });

        console.log("Calculated Contract Address:", deployedAddress);
    } catch (e) {
        console.error("Error occurred:", e.message);
        process.exit(1);
    }
}

main();
