// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {PredictionMarket} from "../src/PredictionMarket.sol";
import {ReputationManager} from "../src/ReputationManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BuySharesScript is Script {
    // --- Configuration ---
    // The specific market you want to bet on
    PredictionMarket constant predictionMarket =
        PredictionMarket(payable(0xeb1c714cfde0E85a5102180C8f8b24fFb3b235Cb));

    // Your collateral token address
    IERC20 constant collateralToken =
        IERC20(0xE73559ce9FD6dde324210A4D250610F41728029d);

    // The ReputationManager contract
    ReputationManager constant reputationManager =
        ReputationManager(payable(0x6c7d513f9EbfE24B4664d7B0cbbC53E26aa33bf6));

    // --- Bet Details ---
    uint256 private constant BET_AMOUNT = 50 * 1e18; // Amount to bet (e.g., 50 tokens)
    uint256 private constant NO_OUTCOME = 0; // Let's bet on "NO" this time

    function run() public {
        vm.startBroadcast();

        // It's good practice to ensure the user is registered before betting.
        // If you run this with the same account, you are already registered.
        // If it's a new user, this line is necessary.
        if (!reputationManager.isUserRegistered(msg.sender)) {
            console.log("User not registered. Registering now...");
            reputationManager.registerUser();
            console.log("User registered successfully!");
        }

        // Step 1: Approve the market to spend your collateral tokens.
        console.log(
            "Approving market to spend",
            BET_AMOUNT / 1e18,
            "tokens..."
        );
        collateralToken.approve(address(predictionMarket), BET_AMOUNT);
        console.log("Approval successful.");

        // Step 2: Buy shares for the "NO" outcome in the existing market.
        console.log("Buying shares for outcome", NO_OUTCOME, "...");
        predictionMarket.buy(NO_OUTCOME, BET_AMOUNT);
        console.log("Successfully purchased shares!");

        vm.stopBroadcast();
    }
}
