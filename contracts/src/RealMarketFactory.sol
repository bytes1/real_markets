// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PredictionMarket.sol";
import "./ExclusiveMarket.sol";
import "./ReputationManager.sol";

/**
 * @title RealMarketFactory
 * @dev A factory for creating both standard and exclusive prediction markets.
 */
contract RealMarketFactory is Ownable {
    address[] public allMarkets;
    IERC20 public immutable collateralToken;
    ReputationManager public immutable reputationManager;

    event MarketCreated(
        address indexed marketAddress,
        string question,
        bool isExclusive
    );

    constructor(
        address _collateralToken,
        address _reputationManager
    ) Ownable(msg.sender) {
        collateralToken = IERC20(_collateralToken);
        reputationManager = ReputationManager(_reputationManager);
    }

    /**
     * @notice Creates a new standard prediction market.
     * @dev Note: The base PredictionMarket does not store a question or end time.
     */
    function createMarket(
        string memory _question,
        uint256 _duration
    ) external returns (address) {
        PredictionMarket newMarket = new PredictionMarket(
            address(collateralToken),
            address(reputationManager)
        );

        address newMarketAddress = address(newMarket);
        allMarkets.push(newMarketAddress);
        emit MarketCreated(newMarketAddress, _question, false);
        return newMarketAddress;
    }

    /**
     * @notice Creates a new exclusive market.
     */
    function createExclusiveMarket(
        string memory _question,
        uint256 _duration,
        uint256 _exclusiveDuration,
        ReputationManager.Tier _requiredTier,
        uint256 _requiredTradeCount
    ) external returns (address) {
        ExclusiveMarket newMarket = new ExclusiveMarket(
            address(collateralToken),
            address(reputationManager),
            _question,
            block.timestamp + _duration,
            _exclusiveDuration,
            _requiredTier,
            _requiredTradeCount,
            owner() // The factory owner becomes the market owner
        );

        address newMarketAddress = address(newMarket);
        allMarkets.push(newMarketAddress);
        emit MarketCreated(newMarketAddress, _question, true);
        return newMarketAddress;
    }

    function getMarkets() external view returns (address[] memory) {
        return allMarkets;
    }
}
