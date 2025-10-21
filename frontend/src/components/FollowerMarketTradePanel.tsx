// File: frontend/src/components/FollowerMarketTradePanel.tsx (Corrected)

import { useState, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import type { FollowerMarket } from "@/lib/types";
import { PredictionMarketABI, ERC20_ABI } from "@/lib/abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { ReclaimProofRequest, type Proof } from "@reclaimprotocol/js-sdk";

const USDC_CONTRACT_ADDRESS = "0xE73559ce9FD6dde324210A4D250610F41728029d";
const USDC_DECIMALS = 18;

interface MarketTradePanelProps {
  market: FollowerMarket;
}

export const FollowerMarketTradePanel = ({ market }: MarketTradePanelProps) => {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<0 | 1>(1);
  const [isFollowerVerified, setIsFollowerVerified] = useState(false);
  const [proofs, setProofs] = useState<
    string | Proof | Proof[] | null | undefined
  >(null); // Keep track of proofs if needed
  const [isLoading, setIsLoading] = useState(false); // For Reclaim loading

  const amountBigInt = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) return 0n;
    return parseUnits(amount, USDC_DECIMALS);
  }, [amount]);

  const { data: userBalance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress!],
    query: {
      enabled: isConnected && isFollowerVerified,
    },
  });

  const { data: cost, isLoading: isLoadingCost } = useReadContract({
    address: market.address as `0x${string}`,
    abi: PredictionMarketABI,
    functionName: "getCost",
    args: [selectedOutcome, amountBigInt],
    query: {
      enabled: amountBigInt > 0 && isFollowerVerified,
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [userAddress!, market.address],
    query: {
      enabled: isConnected && isFollowerVerified,
    },
  });

  const needsApproval = useMemo(() => {
    if (typeof cost !== "bigint" || typeof allowance !== "bigint") {
      return false;
    }
    return cost > allowance;
  }, [cost, allowance]);

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

  const handleVerifyFollower = async () => {
    try {
      setIsLoading(true);

      // Your credentials from the Reclaim Protocol Developer Portal
      const APP_ID = "0x93a344FB2Cb33a6F2DdC6B7B1be5e680Eb09AC5f";
      const APP_SECRET =
        "0xf95b851af554f7ecd03d455357603e93a030cdbb8da3f34e671dbc9ee39fe312";
      const PROVIDER_ID = "30b758d3-9a9a-4755-bf18-10160668f9ca";

      // Initialize the Reclaim SDK
      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
      );

      // Trigger the verification session
      await reclaimProofRequest.triggerReclaimFlow();

      // Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          console.log("Verification successful:", proofs);
          setProofs(proofs);
          // Set the follower as verified on success
          setIsFollowerVerified(true);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("Verification failed", error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error starting verification:", error);
      setIsLoading(false);
    }
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  // All button logic is now contained in this single function.
  const getButtonAction = () => {
    // State 1: Wallet is not connected
    if (!isConnected) {
      return {
        text: "Connect Wallet",
        // This action should be your function to open the wallet connect modal
        action: () => console.log("Trigger wallet connection..."),
        disabled: false,
      };
    }

    // State 2: Wallet is connected, but follower is not verified
    if (!isFollowerVerified) {
      return {
        text: isLoading ? "Verifying..." : "Verify Follower Status",
        action: handleVerifyFollower,
        disabled: isLoading,
      };
    }

    // --- States 3+: Connected AND Verified ---
    // The logic now proceeds to the trading flow.

    // State 3: No amount entered
    if (amountBigInt === 0n) {
      return {
        text: "Enter Amount",
        action: () => {},
        disabled: true,
      };
    }

    // State 4: Amount entered, needs approval
    if (needsApproval) {
      const costToFormat = typeof cost === "bigint" ? cost : 0n;
      return {
        text: `Approve ${formatUnits(costToFormat, USDC_DECIMALS)} USDC`,
        action: handleApprove,
        disabled: false, // Let the main button's `isPending` handle loading
      };
    }

    // State 5: Amount entered, approved, ready to buy
    return {
      text: "Buy Shares",
      action: handleBuy,
      disabled: false, // Let the main button's `isPending` handle loading
    };
  };

  const {
    text: buttonText,
    action: buttonAction,
    disabled: buttonDisabled,
  } = getButtonAction();

  // --- THE STRAY CODE THAT WAS HERE IS NOW REMOVED ---

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
            {/* This block correctly shows *before* verification */}
            {!isFollowerVerified && (
              <div className="mb-4 p-3 rounded-md bg-blue-900/50 text-blue-300 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-semibold">Follower Market</p>
                </div>
                <p className="text-xs">
                  This market is exclusive to:{" "}
                  <strong>{market.accessCondition}</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant={selectedOutcome === 1 ? "default" : "secondary"}
                onClick={() => setSelectedOutcome(1)}
                className="h-16 text-lg bg-green-100 text-green-800 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                disabled={!isFollowerVerified} // Correct: Disable until verified
              >
                Yes {(market.priceYes * 100).toFixed(1)}¢
              </Button>
              <Button
                variant={selectedOutcome === 0 ? "default" : "secondary"}
                onClick={() => setSelectedOutcome(0)}
                className="h-16 text-lg bg-red-100 text-red-800 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                disabled={!isFollowerVerified} // Correct: Disable until verified
              >
                No {(market.priceNo * 100).toFixed(1)}¢
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount of Shares
                </label>
                {isFollowerVerified && typeof userBalance === "bigint" ? (
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
                disabled={!isFollowerVerified} // Correct: Disable until verified
              />
              {typeof cost === "bigint" &&
                amountBigInt > 0n &&
                isFollowerVerified && (
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

          <TabsContent value="sell">
            <p className="text-sm text-gray-400 text-center">
              Selling is not enabled in this example.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
