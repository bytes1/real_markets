import { useState, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import type { Market } from "./MarketCard";
// Import the new ABI
import {
  PredictionMarketABI,
  ERC20_ABI,
  ReputationManagerABI,
} from "@/lib/abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAirService } from "../contexts/AirServiceContext";
import { partnerId, privateKey, kid, jwtAlgorithm } from "@/utils/constants";
import { generateJwt } from "@/utils/jwt";

// Centralized contract addresses
const USDC_CONTRACT_ADDRESS = "0xE73559ce9FD6dde324210A4D250610F41728029d";
const REPUTATION_MANAGER_ADDRESS = "0x6e5b1B891510DbA56D79914bC33AA0c5fBE1C839";
const USDC_DECIMALS = 18;

interface MarketTradePanelProps {
  market: Market;
  mode?: "normal" | "exclusive"; // optional prop
}

export const MarketTradePanel = ({
  market,
  mode = "normal",
}: MarketTradePanelProps) => {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const airService = useAirService();
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<0 | 1>(1);

  const amountBigInt = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) return 0n;
    return parseUnits(amount, USDC_DECIMALS);
  }, [amount]);

  // Check if the user is registered in the ReputationManager
  const { data: isRegistered, refetch: refetchIsRegistered } = useReadContract({
    address: REPUTATION_MANAGER_ADDRESS,
    abi: ReputationManagerABI,
    functionName: "isUserRegistered",
    args: [userAddress!],
    query: {
      enabled: isConnected,
    },
  });

  // Fetch the user's USDC balance only if they are connected AND registered.
  const { data: userBalance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress!],
    query: {
      enabled: isConnected && isRegistered === true,
    },
  });

  // Calculate the cost of the trade. Enabled only when an amount is entered and user is registered.
  const { data: cost, isLoading: isLoadingCost } = useReadContract({
    address: market.address as `0x${string}`,
    abi: PredictionMarketABI,
    functionName: "getCost",
    args: [selectedOutcome, amountBigInt],
    query: {
      enabled: amountBigInt > 0 && isRegistered === true,
    },
  });

  // Check the allowance for the market contract. Enabled only if the user is connected AND registered.
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [userAddress!, market.address],
    query: {
      enabled: isConnected && isRegistered === true,
    },
  });

  const needsApproval = useMemo(() => {
    if (typeof cost !== "bigint" || typeof allowance !== "bigint") {
      return false;
    }
    return cost > allowance;
  }, [cost, allowance]);

  // Handler for the "Register" transaction
  const handleRegister = async () => {
    const programId =
      mode === "normal" ? "c21pp030oeirj0051859o0" : "c21ps031izo3y00g1859n8";
    const redirectUrl = "http://localhost:5173/issue";

    if (!airService) {
      alert("AirService is not initialized. Check the console for errors.");
      return;
    }

    try {
      const jwt = await generateJwt({
        partnerId,
        privateKey,
        kid,
        jwtAlgorithm,
      });

      if (!jwt) {
        throw new Error("Failed to generate JWT");
      }

      const result = await airService.verifyCredential({
        authToken: jwt,
        programId: programId,
        redirectUrl: redirectUrl,
      });

      console.log("Verification Result:", result);

      if (result.status !== "Compliant") {
        throw new Error(
          `Credential verification failed. Status: ${result.status}`
        );
      }

      await writeContractAsync({
        address: REPUTATION_MANAGER_ADDRESS,
        abi: ReputationManagerABI,
        functionName: "registerUser",
      });

      await refetchIsRegistered();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleApprove = async () => {
    if (typeof cost !== "bigint") return;
    try {
      await writeContractAsync({
        address: USDC_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [market.address, cost],
      });
      await refetchAllowance();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleBuy = async () => {
    if (typeof cost !== "bigint" || amountBigInt === 0n) return;
    try {
      await writeContractAsync({
        address: market.address as `0x${string}`,
        abi: PredictionMarketABI,
        functionName: "buy",
        args: [selectedOutcome, amountBigInt],
      });
    } catch (error) {
      console.error("Buy failed:", error);
    }
  };

  const getButtonAction = () => {
    if (!isConnected)
      return { text: "Connect Wallet", action: () => {}, disabled: true };
    // Primary check: User must be registered to proceed.
    if (isRegistered === false)
      return { text: "Register to Participate", action: handleRegister };
    if (amountBigInt === 0n)
      return { text: "Enter Amount", action: () => {}, disabled: true };
    if (needsApproval) {
      const costToFormat = typeof cost === "bigint" ? cost : 0n;
      return {
        text: `Approve ${formatUnits(costToFormat, USDC_DECIMALS)} USDC`,
        action: handleApprove,
      };
    }
    return { text: "Buy Shares", action: handleBuy };
  };

  const {
    text: buttonText,
    action: buttonAction,
    disabled: buttonDisabled,
  } = getButtonAction();

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="buy" onValueChange={() => {}}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell" disabled>
              Sell
            </TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="mt-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant={selectedOutcome === 1 ? "default" : "secondary"}
                onClick={() => setSelectedOutcome(1)}
                className="h-16 text-lg bg-green-100 text-green-800 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Yes {(market.priceYes * 100).toFixed(1)}¢
              </Button>
              <Button
                variant={selectedOutcome === 0 ? "default" : "secondary"}
                onClick={() => setSelectedOutcome(0)}
                className="h-16 text-lg bg-red-100 text-red-800 data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                No {(market.priceNo * 100).toFixed(1)}¢
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount of Shares
                </label>
                {/* Balance is only shown if the user is registered and the hook has fetched the data */}
                {isRegistered && typeof userBalance === "bigint" ? (
                  <span className="text-sm text-gray-500">
                    Balance:{" "}
                    {Number(
                      formatUnits(userBalance, USDC_DECIMALS)
                    ).toLocaleString()}
                  </span>
                ) : null}
              </div>
              <Input
                id="amount"
                placeholder="e.g., 100"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isRegistered} // Input is disabled until user is registered
              />
              {typeof cost === "bigint" && amountBigInt > 0n && (
                <p className="text-sm text-gray-500 text-right">
                  Cost: ~{formatUnits(cost, USDC_DECIMALS)} USDC
                </p>
              )}
            </div>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={buttonAction}
              disabled={buttonDisabled || isLoadingCost || isPending}
            >
              {isPending
                ? "Confirming..."
                : isLoadingCost
                ? "Calculating Cost..."
                : buttonText}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
