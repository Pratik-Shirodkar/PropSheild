const ethers = require("ethers");

const deployer = "0x352350F4e84b6BB647CaeD43da5978D7EC6dbCcF";
const nonce = 0;

console.log("Calculating for:", deployer, "Nonce:", nonce);

let getContractAddress;
if (typeof ethers.getContractAddress === "function") {
    getContractAddress = ethers.getContractAddress;
} else if (ethers.ethers && typeof ethers.ethers.getContractAddress === "function") {
    getContractAddress = ethers.ethers.getContractAddress;
}

if (getContractAddress) {
    const address = getContractAddress({ from: deployer, nonce });
    console.log("CONTRACT_ADDRESS=" + address);
} else {
    console.error("Function not found");
}
