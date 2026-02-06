const { getContractAddress } = require("ethers");

const deployer = "0x352350F4e84b6BB647CaeD43da5978D7EC6dbCcF";
const nonce = 0; // First transaction

try {
    const address = getContractAddress({
        from: deployer,
        nonce: nonce
    });
    console.log("Calculated Address:", address);
} catch (e) {
    console.error("Error:", e.message);
}
