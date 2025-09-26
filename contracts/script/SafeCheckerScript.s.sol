// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";

// Minimal interface with only the functions we need
interface IMinimalVerifier {
    function requestIdExists(uint64 requestId) external view returns (bool);
    function isProofVerified(
        address sender,
        uint64 requestId
    ) external view returns (bool);
}

contract SafeChecker {
    address public constant PROOF_VERIFIER =
        0x60E841AA346F7f9b87e3B376E360ccA8d3F08Ac7;

    function safeIsVerified(
        address sender,
        uint64 requestId
    ) external view returns (bool) {
        IMinimalVerifier verifier = IMinimalVerifier(PROOF_VERIFIER);

        if (!verifier.requestIdExists(requestId)) {
            return false; // prevent revert
        }

        return verifier.isProofVerified(sender, requestId);
    }
}

contract SafeCheckerScript is Script {
    SafeChecker public safeChecker;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy the SafeChecker contract
        safeChecker = new SafeChecker();

        console2.log("SafeChecker deployed at:", address(safeChecker));
        console2.log("Proof Verifier address:", safeChecker.PROOF_VERIFIER());

        vm.stopBroadcast();
    }

    // Test function with your specific values
    function testSpecificVerification() public {
        // Your provided values
        uint64 requestId = 1971348101806788608;
        address sender = 0x24ba9a2943447B98B5eb159fE2DE40b00Ca2871C;

        // Deploy contract if not already deployed
        if (address(safeChecker) == address(0)) {
            safeChecker = new SafeChecker();
            console2.log("SafeChecker deployed at:", address(safeChecker));
        }

        console2.log("=== Testing Verification ===");
        console2.log("Request ID:", requestId);
        console2.log("Sender address:", sender);

        bool isVerified = safeChecker.safeIsVerified(sender, requestId);
        console2.log("Is verified:", isVerified);

        // Additional checks
        IMinimalVerifier verifier = IMinimalVerifier(
            safeChecker.PROOF_VERIFIER()
        );
        bool requestExists = verifier.requestIdExists(requestId);
        console2.log("Request exists:", requestExists);

        if (requestExists) {
            bool proofVerified = verifier.isProofVerified(sender, requestId);
            console2.log("Direct proof verification:", proofVerified);
        }
    }

    // Optional: Generic helper function to test any values
    function testVerification(address sender, uint64 requestId) public view {
        require(address(safeChecker) != address(0), "Contract not deployed");

        bool isVerified = safeChecker.safeIsVerified(sender, requestId);
        console2.log("Verification result for sender:", sender);
        console2.log("Request ID:", requestId);
        console2.log("Is verified:", isVerified);
    }
}
