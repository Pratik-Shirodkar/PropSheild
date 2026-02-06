const ethers = require("ethers");
let keccak256;
if (ethers.keccak256) keccak256 = ethers.keccak256;
else if (ethers.ethers && ethers.ethers.keccak256) keccak256 = ethers.ethers.keccak256;
else if (ethers.utils && ethers.utils.keccak256) keccak256 = ethers.utils.keccak256;

if (!keccak256) {
    console.error("No keccak256 found");
    process.exit(1);
}

const deployer = "352350F4e84b6BB647CaeD43da5978D7EC6dbCcF"; // no 0x
const nonce = 0;

// RLP Encode [deployer, 0]
// 0xd6 = 0xc0 + 22 bytes total
// 0x94 = 0x80 + 20 bytes address
// 0x80 = 0 value (nonce)
const rawHex = "0xd6" + "94" + deployer + "80";

const hash = keccak256(rawHex); // ethers handles 0x string
const address = "0x" + hash.slice(-40);
console.log("CONTRACT_ADDRESS=" + address);
