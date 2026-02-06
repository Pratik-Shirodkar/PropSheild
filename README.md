# PropShield 🛡️

**The Privacy-Preserving Liquidity Marketplace for Real World Assets.**

PropShield goes beyond simple "identity badges." We unlock DeFi liquidity for Real Estate owners by using Trusted Execution Environments (TEEs) to mathematically prove income and creditworthiness without *ever* revealing sensitive tenant data.

---

## 🏆 Hack4Privacy Hackathon Submission

**Differentiation:**
Unlike simple verification tools, PropShield is a **dual-sided marketplace** that connects privacy-conscious borrowers with DeFi lenders.

**The Integrated RWA Protocol for Privacy-First Liquidity.**

PropShield turns hidden real-world solvency (leases, bank history) into on-chain liquidity, without ever leaking sensitive business data. We combine **RWA Tokenization**, **Algorithmic Lending**, and **Portable Identity** into one cohesive architecture.

---

## 🏆 Hack4Privacy Hackathon Submission

**The "Winning" Architecture:**
We implemented 3 Core Pillars to bridge the trust gap between off-chain assets and on-chain capital.

### 🏛️ Pillar 1: The "Factoring" Engine (RWA Track)
*Logic: A lease is a promise of future payments (like an invoice).*
1.  **Confidential Ingestion**: Landlords upload Rent Rolls/Leases (CSV).
2.  **TEE Verification**: iExec TEEs cryptographically verify the cashflow duration and amount.
3.  **Result**: Mints a **"Verified Cashflow"** credential (privacy-preserved).

### ⚖️ Pillar 2: The "Solvency" Score (Identity Track)
*Logic: A lease is useless if the tenant doesn't pay.*
1.  **Solvency Check**: The TEE cross-references rent rolls with payment history.
2.  **SBT Minting**: Mints a **Soulbound Token (SBT)** representing the landlord's verified reputation.
3.  **Tiered Status**: Assigns **Tier A** (100% History) or **Tier B** status on-chain.

### 💧 Pillar 3: The "Liquid" Marketplace (DeFi Track)
*Logic: This is where the money moves.*
1.  **Algorithmic Lending**: Smart contracts read the Solvency SBT to verify risk.
2.  **Lender View**: Lenders browse anonymized "Cashflow Opportunities".
3.  **Trustless Funding**: Capital is deployed based on verified TEE proofs (80% LTV for Tier A).

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS
-   **Confidential Computing**: iExec SDK (`@iexec/dataprotector`), iExec Bellecour Sidechain
-   **Blockchain**: Ethereum Sepolia (L1) for Lending Contract, iExec Bellecour (L2) for TEE
-   **Smart Contracts**: Solidity (ERC721 SBT, Lending Logic), Hardhat
-   **Wallet**: Wagmi v2, Reown AppKit

---

## 🏗️ Architecture

1.  **User** uploads `rent_roll.csv` → Encrypted via iExec SDK.
2.  **User** grants access to the `PropShield Scorer` iApp (TEE).
3.  **iApp** runs in an enclave, decrypts data, calculates Score/NOI, and posts the result to the Oracle.
4.  **PropShieldLending** contract updates the on-chain Credit Limit.
5.  **Frontend** reflects the new limit, unlocks SBT minting, and generates the PDF report.

---

## 🚦 How to Run Locally

### Prerequisites
- Node.js v18+
- MetaMask Wallet with Sepolia ETH and iExec RLC (Testnet)

### Installation
```bash
git clone https://github.com/your-username/propshield.git
cd propshield
npm install
```

### Environment Setup
Create a `.env` file:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x4bacd464de5e50fcc978345df4be83dc14c8a888
PRIVATE_KEY=your_wallet_private_key
```

### Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📜 Contract Addresses

-   **Lending Contract (Sepolia):** `0x4bacd464de5e50fcc978345df4be83dc14c8a888`
-   **TEE Application (Bellecour):** `0xa1974676795629B7c6cD9A8b17fD27fDdA78ad41`

---

## 🎥 Demo
[Link to Demo Video]