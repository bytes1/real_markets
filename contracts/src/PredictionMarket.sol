// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ReputationManager.sol";

contract PredictionMarket is ERC1155, Ownable {
    // Token IDs for the outcomes
    uint256 public constant NO_OUTCOME_ID = 0;
    uint256 public constant YES_OUTCOME_ID = 1;

    // The collateral token (e.g., USDC)
    IERC20 public immutable collateralToken;

    // The reputation manager contract for identity and score updates
    ReputationManager public immutable reputationManager;

    // REMOVED: Oracle is no longer used. Resolution is handled by the contract owner (admin).

    // State variables
    bool public isResolved = false;
    uint256 public winningOutcome;
    uint256 public constant REPUTATION_REWARD = 10; // Points for a correct prediction

    // AMM state: number of shares for each outcome
    uint256[] public outcomeShares;

    event MarketResolved(uint256 indexed winningOutcome);
    event SharesPurchased(
        address indexed buyer,
        uint256 indexed outcome,
        uint256 amount,
        uint256 cost
    );
    event SharesSold(
        address indexed seller,
        uint256 indexed outcome,
        uint256 amount,
        uint256 proceeds
    );
    event WinningsRedeemed(address indexed user, uint256 amount);

    constructor(
        address _collateralToken,
        address _reputationManager
    ) ERC1155("") Ownable(msg.sender) {
        collateralToken = IERC20(_collateralToken);
        reputationManager = ReputationManager(_reputationManager);
        outcomeShares = new uint256[](2); // For binary market
    }

    /**
     * @notice Calculates the cost to buy a certain number of shares.
     * @dev This is a simplified AMM.
     */
    function getCost(
        uint256 _outcomeIndex,
        uint256 _amount
    ) public view returns (uint256) {
        require(_outcomeIndex < 2, "Invalid outcome index");
        // Simplified AMM: price = (other shares) / (this shares + other shares)
        // This is a placeholder for a proper bonding curve.
        uint256 thisPool = outcomeShares[_outcomeIndex];
        uint256 otherPool = outcomeShares[1 - _outcomeIndex];
        if (thisPool == 0 && otherPool == 0) return _amount; // Initial price is 1:1
        return (_amount * (otherPool + thisPool)) / (thisPool + 1);
    }

    /**
     * @notice The main "bet" function. Buy shares of an outcome.
     */
    function buy(uint256 _outcomeIndex, uint256 _amount) external {
        require(!isResolved, "Market is resolved");
        require(
            reputationManager.isUserRegistered(msg.sender),
            "User not registered"
        );
        require(_amount > 0, "Amount must be positive");

        uint256 cost = getCost(_outcomeIndex, _amount);

        // Transfer collateral from user to this contract
        collateralToken.transferFrom(msg.sender, address(this), cost);

        // Update AMM pool
        outcomeShares[_outcomeIndex] += _amount;

        // Mint outcome shares to the user
        _mint(msg.sender, _outcomeIndex, _amount, "");

        emit SharesPurchased(msg.sender, _outcomeIndex, _amount, cost);
    }

    /**
     * @notice Sell shares back to the market before resolution.
     */
    function sell(uint256 _outcomeIndex, uint256 _amount) external {
        // Implementation for selling would be the reverse of buying.
        // For simplicity in this example, we focus on buy, resolve, redeem.
    }

    /**
     * @notice Resolves the market. Can only be called by the contract owner (admin).
     */
    function resolve(uint256 _winningOutcome) external onlyOwner {
        require(!isResolved, "Market already resolved");

        isResolved = true;
        winningOutcome = _winningOutcome;
        emit MarketResolved(_winningOutcome);
    }

    /**
     * @notice After resolution, winners redeem their shares for collateral.
     */
    function redeem() external {
        require(isResolved, "Market not yet resolved");

        uint256 winningShares = balanceOf(msg.sender, winningOutcome);
        require(winningShares > 0, "No winning shares to redeem");

        // Burn the user's winning shares
        _burn(msg.sender, winningOutcome, winningShares);

        // Calculate and transfer payout
        uint256 totalWinningShares = outcomeShares[winningOutcome];
        uint256 totalCollateral = collateralToken.balanceOf(address(this));
        uint256 payout = (totalCollateral * winningShares) / totalWinningShares;

        collateralToken.transfer(msg.sender, payout);

        // Update user's reputation for making a correct prediction
        reputationManager.updateReputation(
            msg.sender,
            int256(REPUTATION_REWARD)
        );

        emit WinningsRedeemed(msg.sender, payout);
    }
}
