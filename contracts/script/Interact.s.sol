// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;

// import {Script, console} from "forge-std/Script.sol";
// import {ReputationManager} from "../src/ReputationManager.sol";
// import {RealMarketFactory} from "../src/RealMarketFactory.sol";
// import {PredictionMarket} from "../src/PredictionMarket.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract InteractScript is Script {
//     // --- New Contract and Token Addresses ---
//     RealMarketFactory constant realMarketFactory =
//         RealMarketFactory(payable(0xcAd29C02fbF69DcBd1e06903aa0114863585Aba2));
//     ReputationManager constant reputationManager =
//         ReputationManager(payable(0x6c7d513f9EbfE24B4664d7B0cbbC53E26aa33bf6));
//     IERC20 constant collateralToken =
//         IERC20(0xE73559ce9FD6dde324210A4D250610F41728029d);

//     // --- Market and Bet Configuration ---
//     string private constant MARKET_QUESTION = "Will AI achieve AGI by 2030?";
//     uint256 private constant BET_AMOUNT = 100 * 1e18;
//     uint256 private constant YES_OUTCOME = 1;

//     function run() public {
//         vm.startBroadcast();

//         console.log("Registering user...");
//         // reputationManager.registerUser();
//         console.log("User registered successfully!");

//         console.log("Creating a new market for question:", MARKET_QUESTION);
//         address newMarketAddress = realMarketFactory.createMarket(
//             MARKET_QUESTION
//         );
//         PredictionMarket newMarket = PredictionMarket(
//             payable(newMarketAddress)
//         );
//         console.log("New PredictionMarket deployed at:", newMarketAddress);

//         console.log("Approving market to spend collateral...");
//         collateralToken.approve(newMarketAddress, BET_AMOUNT);
//         console.log("Approval successful.");

//         console.log("Placing a bet...");
//         newMarket.buy(YES_OUTCOME, BET_AMOUNT);
//         console.log("Bet placed successfully!");

//         vm.stopBroadcast();
//     }
// }

pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RealMarketFactory} from "../src/RealMarketFactory.sol";

contract DeployMarketsScript is Script {
    // Address of your deployed RealMarketFactory
    RealMarketFactory constant realMarketFactory =
        RealMarketFactory(payable(0xd25929931c0A761D8Ce7cE6fa6b6262223F828ac));

    function run() public {
        // --- An array of 6 questions for the new markets ---
        string[4] memory marketQuestions = [
            "Will Ethereum's price surpass $10,000 by the end of 2025?",
            "Will a decentralized social media platform reach 100 million active users by 2026?",
            "Will the global crypto market cap exceed $5 trillion in 2025?",
            "Will a major central bank issue a consumer-facing CBDC before 2027?"
        ];

        vm.startBroadcast();

        console.log("Deploying 6 new prediction markets...");

        // --- Loop to create each of the 6 markets ---
        for (uint i = 0; i < marketQuestions.length; i++) {
            console.log("Creating market for question:", marketQuestions[i]);

            address newMarketAddress = realMarketFactory.createMarket(
                marketQuestions[i]
            );

            console.log(
                "=> Market %d deployed at: %s",
                i + 1,
                newMarketAddress
            );
        }

        console.log("All 6 markets have been deployed successfully!");

        vm.stopBroadcast();
    }
}
