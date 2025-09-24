// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PredictionMarket.sol";

contract RealMarketFactory is Ownable {
    address[] public allMarkets;

    address public immutable reputationManager;
    address public immutable collateralToken;

    event MarketCreated(
        address indexed marketAddress,
        address indexed creator,
        string question
    );

    constructor(
        address _reputationManager,
        address _collateralToken
    ) Ownable(msg.sender) {
        reputationManager = _reputationManager;
        collateralToken = _collateralToken;
    }

    /**
     * @notice Creates and deploys a new PredictionMarket.
     * @param _question A string describing the market question.
     * @return The address of the newly created market contract.
     */
    function createMarket(
        string calldata _question
    ) external returns (address) {
        PredictionMarket newMarket = new PredictionMarket(
            collateralToken,
            reputationManager
        );

        // Transfer ownership of the new market to the factory owner (protocol admin)
        // so they have the authority to resolve it.
        newMarket.transferOwnership(owner());

        allMarkets.push(address(newMarket));

        // Authorize the new market to update reputation scores
        ReputationManager(reputationManager).setAuthorizedUpdater(
            address(newMarket),
            true
        );

        emit MarketCreated(address(newMarket), msg.sender, _question);
        return address(newMarket);
    }

    /**
     * @notice Gets the number of markets created.
     * @return The total count of markets.
     */
    function marketCount() external view returns (uint256) {
        return allMarkets.length;
    }
}
