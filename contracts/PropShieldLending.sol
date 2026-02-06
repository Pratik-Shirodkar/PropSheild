// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PropShieldLending (SBT Upgrade)
 * @dev Soulbound Token (SBT) for Credit Scoring.
 * Inherits ERC721 but prevents transfers.
 */
contract PropShieldLending is ERC721, ERC721URIStorage, Ownable {
    
    // --- State Variables ---
    address public oracle; // iExec TEE address
    uint256 private _nextTokenId;

    struct BorrowerProfile {
        uint256 verifiedIncome;
        uint256 creditScore;
        uint256 creditLimit;
        uint256 lastUpdate;
    }

    mapping(address => BorrowerProfile) public borrowers;

    // --- Events ---
    event CreditLineUpdated(address indexed borrower, uint256 limit, uint256 score);
    event SoulboundMinted(address indexed borrower, uint256 tokenId);

    constructor() ERC721("PropShield Credit Score", "PCS") Ownable(msg.sender) {
        oracle = msg.sender; 
    }

    // --- Configuration ---
    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not Oracle");
        _;
    }

    // --- 1. TEE Logic (unchanged) ---
    function updateCreditLine(
        address _borrower,
        uint256 _income,
        uint256 _score
    ) external onlyOracle {
        uint256 limit = 0;
        if (_score >= 80) limit = (_income * 50) / 100;
        else if (_score >= 50) limit = (_income * 30) / 100;

        borrowers[_borrower] = BorrowerProfile({
            verifiedIncome: _income,
            creditScore: _score,
            creditLimit: limit,
            lastUpdate: block.timestamp
        });

        emit CreditLineUpdated(_borrower, limit, _score);
    }

    // --- 2. SBT Logic (NEW) ---
    function mintSBT(string memory tokenURI) external {
        // 1. Check eligibility (Score > 80)
        require(borrowers[msg.sender].creditScore >= 80, "Score too low for SBT");
        
        // 2. Check if already has SBT
        require(balanceOf(msg.sender) == 0, "Already minted");

        // 3. Mint
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit SoulboundMinted(msg.sender, tokenId);
    }

    // --- 3. Soulbound Enforcements ---
    // Override transfer functions to prevent moving the token
    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound: Transfer failed");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("Soulbound: Transfer failed");
    }

    // Required overrides for Solidity inheritance
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
