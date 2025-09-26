// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ReputationManager} from "../src/ReputationManager.sol";
import {RealMarketFactory} from "../src/RealMarketFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployScript is Script {
    function run() public {
        address collateralTokenAddress = 0xE73559ce9FD6dde324210A4D250610F41728029d;

        vm.startBroadcast();

        ReputationManager reputationManager = new ReputationManager();
        console.log(
            "ReputationManager deployed at:",
            address(reputationManager)
        );

        RealMarketFactory realMarketFactory = new RealMarketFactory(
            address(reputationManager),
            collateralTokenAddress
        );
        console.log(
            "RealMarketFactory deployed at:",
            address(realMarketFactory)
        );

        vm.stopBroadcast();
    }
}
