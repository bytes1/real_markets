// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ReputationManager} from "../src/ReputationManager.sol";

contract SetupScript is Script {
    // --- New Addresses from Your Latest Deployment ---
    address constant factoryAddress =
        0xd25929931c0A761D8Ce7cE6fa6b6262223F828ac;
    ReputationManager constant reputationManager =
        ReputationManager(payable(0x6e5b1B891510DbA56D79914bC33AA0c5fBE1C839));

    function run() public {
        vm.startBroadcast();

        // Transfer ownership of the new ReputationManager to the new RealMarketFactory
        console.log(
            "Transferring ownership of ReputationManager to the factory..."
        );
        reputationManager.transferOwnership(factoryAddress);
        console.log("Ownership transferred successfully!");

        vm.stopBroadcast();
    }
}
