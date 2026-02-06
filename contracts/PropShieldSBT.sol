// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IPropShieldLending {
    struct BorrowerProfile {
        uint256 verifiedIncome;
        uint256 creditScore;
        uint256 creditLimit;
        uint256 lastUpdate;
    }
    function borrowers(address user) external view returns (BorrowerProfile memory);
}

/**
 * @title PropShieldSBT
 * @dev Soulbound Token for Verified Borrowers with Credit Score > 80
 */
contract PropShieldSBT is ERC721, Ownable {
    IPropShieldLending public lendingContract;
    uint256 private _nextTokenId;

    event BadgeMinted(address indexed user, uint256 tokenId, uint256 score);

    constructor(address _lendingContractAddress) ERC721("Verified Borrower Badge", "VPS") Ownable(msg.sender) {
        lendingContract = IPropShieldLending(_lendingContractAddress);
    }

    function setLendingContract(address _newInstance) external onlyOwner {
        lendingContract = IPropShieldLending(_newInstance);
    }

    function mint() external {
        // 1. Check eligibility from Lending Contract
        IPropShieldLending.BorrowerProfile memory profile = lendingContract.borrowers(msg.sender);
        
        require(profile.creditScore >= 80, "Score too low for Badge (Min 80)");
        require(balanceOf(msg.sender) == 0, "Already verified");

        // 2. Mint Badge
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        emit BadgeMinted(msg.sender, tokenId, profile.creditScore);
    }

    // Soulbound Implementation: Block transfers
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("SBT: Non-transferable");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        revert("SBT: Non-transferable");
    }
}
