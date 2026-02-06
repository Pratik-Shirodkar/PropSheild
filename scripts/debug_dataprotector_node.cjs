const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    try {
        console.log("Debugging DataProtector from Node.js...");
        // Dynamic import for ESM package
        const { IExecDataProtector } = await import("@iexec/dataprotector");

        // 1. Setup Wallet on Bellecour
        const rpcUrl = "https://bellecour.iex.ec";
        // Use static provider to avoid network detection issues in simulations
        const provider = new ethers.JsonRpcProvider(rpcUrl, {
            chainId: 134,
            name: 'bellecour'
        });
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log("Wallet:", wallet.address);

        // 2. Initialize SDK
        // In v2 beta, we might need to pass the provider/signer differently or just the provider.
        // Documentation says: new IExecDataProtector(provider)
        const dataProtector = new IExecDataProtector(wallet);

        console.log("Protecting data...");
        const protectedData = await dataProtector.core.protectData({
            name: "Debug-RentRoll-Node",
            data: {
                rentRollCsv: "Tenant,Rent,Status\nAlice,1000,Paid"
            }
        });

        console.log("✅ Success!");
        console.log("Protected Data Address:", protectedData.address);

    } catch (e) {
        console.error("❌ Failed:");
        console.error(e);
    }
}

main();
