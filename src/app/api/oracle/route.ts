import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { PropShieldLendingABI } from '@/config/abi';

export async function POST(request: Request) {
    try {
        const { address } = await request.json();

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const privateKey = process.env.PRIVATE_KEY;
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

        if (!privateKey || !contractAddress) {
            console.error("Missing env vars:", { hasKey: !!privateKey, hasAddress: !!contractAddress });
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // Connect to Sepolia (Robust RPC)
        const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, PropShieldLendingABI, wallet);

        console.log(`[Oracle API] Updating credit line for ${address}...`);

        // Simulate TEE result: Income=54000, Score=100
        // This transaction comes from the "Oracle" (our deployer wallet)
        const tx = await contract.updateCreditLine(address, 54000, 100);
        console.log(`[Oracle API] Tx sent: ${tx.hash}`);

        // Wait for 1 confirmation to ensure frontend picks it up
        await tx.wait(1);

        return NextResponse.json({ success: true, txHash: tx.hash });

    } catch (error: any) {
        console.error("[Oracle API] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
