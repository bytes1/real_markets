// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";

/**
 * @title ExclusiveMarket
 * @dev Inherits from PredictionMarket and adds an initial period of exclusive access.
 */
contract ExclusiveMarket is PredictionMarket {
    // Market details that are not in the base PredictionMarket contract
    string public question;
    uint256 public immutable endsAt;

    // Exclusivity details
    uint256 public immutable exclusiveUntil;
    ReputationManager.Tier public immutable requiredTier;
    uint256 public immutable requiredTradeCount;

    constructor(
        address _collateralToken,
        address _reputationManager,
        string memory _question,
        uint256 _endsAt,
        uint256 _exclusiveDuration,
        ReputationManager.Tier _requiredTier,
        uint256 _requiredTradeCount,
        address _owner
    )
        PredictionMarket(
            // Calls the original constructor
            _collateralToken,
            _reputationManager
        )
    {
        question = _question;
        endsAt = _endsAt;
        exclusiveUntil = block.timestamp + _exclusiveDuration;
        requiredTier = _requiredTier;
        requiredTradeCount = _requiredTradeCount;

        transferOwnership(_owner);
    }

    /**
     * @notice Overrides the buy function to add exclusivity and end-time checks.
     * @dev Re-implements the original buy logic as super.buy() is not accessible.
     */
    function buy(uint256 _outcomeIndex, uint256 _amount) public override {
        // --- Start of Custom Logic for ExclusiveMarket ---
        require(block.timestamp < endsAt, "Market has ended");

        if (block.timestamp < exclusiveUntil) {
            require(
                reputationManager.userTiers(msg.sender) >= requiredTier,
                "User does not meet the required tier"
            );
            require(
                reputationManager.tradingHistory(msg.sender) >=
                    requiredTradeCount,
                "User does not have enough trades"
            );
        }
        // --- End of Custom Logic ---

        // --- Start of Re-implemented Logic from PredictionMarket.sol ---
        require(!isResolved, "Market is resolved");
        require(
            reputationManager.isUserRegistered(msg.sender),
            "User not registered"
        );
        require(_amount > 0, "Amount must be positive");

        uint256 cost = getCost(_outcomeIndex, _amount);

        collateralToken.transferFrom(msg.sender, address(this), cost);

        outcomeShares[_outcomeIndex] += _amount;

        _mint(msg.sender, _outcomeIndex, _amount, "");

        emit SharesPurchased(msg.sender, _outcomeIndex, _amount, cost);
        // --- End of Re-implemented Logic ---
    }
}
