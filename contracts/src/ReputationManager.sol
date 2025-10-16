// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

interface IMinimalVerifier {
    function requestIdExists(uint64 requestId) external view returns (bool);
    function isProofVerified(
        address sender,
        uint64 requestId
    ) external view returns (bool);
}

contract ReputationManager is Ownable {
    enum Tier {
        Novice,
        Apprentice,
        Trader,
        Expert,
        Master
    }

    // Mapping from a user's address to their reputation score
    mapping(address => int256) public reputationScores;
    // Mapping to track a user's trading history
    mapping(address => uint256) public tradingHistory;
    // Mapping to track a user's tier
    mapping(address => Tier) public userTiers;

    uint64 private constant VERIFICATION_REQUEST_ID = 1971348101806788608;
    IMinimalVerifier verifier =
        IMinimalVerifier(0xEfdefe08C6cD74CFEB2f0CC2B9401c52B859B427);
    // Mapping to track registered users to prevent Sybil attacks
    mapping(address => bool) private _registeredUsers;
    // Mapping to authorize contracts (e.g., markets) to update reputation
    mapping(address => bool) public authorizedUpdaters;

    event UserRegistered(address indexed user);
    event ReputationUpdated(
        address indexed user,
        int256 newScore,
        int256 change
    );
    event UpdaterAuthorized(address indexed updater, bool isAuthorized);
    event TradingHistoryUpdated(address indexed user, uint256 tradeCount);
    event TierUpdated(address indexed user, Tier newTier);

    constructor() Ownable(msg.sender) {}

    function registerUser() external {
        require(
            !_registeredUsers[msg.sender],
            "ReputationManager: User already registered"
        );
        require(
            verifier.isProofVerified(msg.sender, VERIFICATION_REQUEST_ID),
            "ReputationManager: Proof verification required"
        );
        _registeredUsers[msg.sender] = true;
        reputationScores[msg.sender] = 0; // Starting reputation
        tradingHistory[msg.sender] = 0; // Starting trading history
        userTiers[msg.sender] = Tier.Novice; // Starting Tier
        emit UserRegistered(msg.sender);
    }

    /**
     * @notice Updates a user's reputation score.
     * @dev Can only be called by an authorized contract (like a market upon resolution).
     * The change can be positive or negative.
     * @param _user The address of the user to update.
     * @param _scoreChange The amount to change the score by (can be negative).
     */
    function updateReputation(address _user, int256 _scoreChange) external {
        require(
            authorizedUpdaters[msg.sender],
            "ReputationManager: Caller is not an authorized updater"
        );
        require(
            _registeredUsers[_user],
            "ReputationManager: User is not registered"
        );
        int256 currentScore = reputationScores[_user];
        int256 newScore = currentScore + _scoreChange;
        reputationScores[_user] = newScore;
        _updateTier(_user);

        emit ReputationUpdated(_user, newScore, _scoreChange);
    }

    /**
     * @notice Increments a user's trading history count.
     * @dev Can only be called by an authorized contract.
     * @param _user The address of the user to update.
     */
    function incrementTradingHistory(address _user) external {
        require(
            authorizedUpdaters[msg.sender],
            "ReputationManager: Caller is not an authorized updater"
        );
        require(
            _registeredUsers[_user],
            "ReputationManager: User is not registered"
        );
        tradingHistory[_user]++;
        _updateTier(_user);
        emit TradingHistoryUpdated(_user, tradingHistory[_user]);
    }

    /**
     * @notice Grants or revokes authorization for a contract to update reputation scores.
     * @dev Only the owner (the protocol admin) can call this.
     * @param _updater The address of the contract to authorize/de-authorize.
     * @param _isAuthorized The authorization status.
     */
    function setAuthorizedUpdater(
        address _updater,
        bool _isAuthorized
    ) external onlyOwner {
        authorizedUpdaters[_updater] = _isAuthorized;
        emit UpdaterAuthorized(_updater, _isAuthorized);
    }

    /**
     * @notice Checks if a user is registered.
     * @param _user The user's address.
     * @return A boolean indicating registration status.
     */
    function isUserRegistered(address _user) external view returns (bool) {
        return _registeredUsers[_user];
    }

    /**
     * @notice Internal function to update a user's tier based on their activity.
     * @param _user The address of the user to update.
     */
    function _updateTier(address _user) internal {
        Tier oldTier = userTiers[_user];
        Tier newTier = _calculateTier(_user);
        if (newTier != oldTier) {
            userTiers[_user] = newTier;
            emit TierUpdated(_user, newTier);
        }
    }

    /**
     * @notice Calculates a user's tier based on their reputation and trading history.
     * @param _user The user's address.
     * @return The calculated tier.
     */
    function _calculateTier(address _user) internal view returns (Tier) {
        int256 score = reputationScores[_user];
        uint256 trades = tradingHistory[_user];

        if (score >= 1000 && trades >= 100) {
            return Tier.Master;
        }
        if (score >= 500 && trades >= 50) {
            return Tier.Expert;
        }
        if (score >= 100 && trades >= 10) {
            return Tier.Trader;
        }
        if (score >= 20 && trades >= 2) {
            return Tier.Apprentice;
        }
        return Tier.Novice;
    }
}
