const ethers = require("ethers");
console.log("Keys:", Object.keys(ethers));
if (ethers.ethers) {
    console.log("ethers.ethers Keys:", Object.keys(ethers.ethers));
}
try {
    console.log("version:", ethers.version);
} catch (e) { }
