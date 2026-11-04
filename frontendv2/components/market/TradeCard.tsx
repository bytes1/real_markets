// components/market/TradeCard.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Market } from "@/lib/data";
import { TimelineCard } from "./TimelineCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- IMPORTS ---
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { parseEther, maxUint256, erc20Abi, formatEther } from "viem";
import { Loader2, Wallet, Info, ShieldCheck } from "lucide-react"; // Added ShieldCheck

// --- NEW IMPORTS ---
import { predictionMarketABI } from "@/lib/abi/PredictionMarketABI";
import { verificationABI } from "@/lib/abi/VerificationABI"; // 1. Import Verification ABI
import { useCredentialVerification } from "@/lib/hooks/useCredentialVerification"; // 2. Import Off-chain Hook
import { useAirkit } from "@/lib/hooks/useAirkit"; // 3. Import Airkit Hook
// --- END IMPORTS ---

// --- CONTRACT CONFIGURATION ---
const PREDICTION_MARKET_ADDRESS = "0xe82aF7a72776dF61F8B14A14965C2A21572A1dC9";
const MUSD_TOKEN_ADDRESS = "0xE73559ce9FD6dde324210A4D250610F41728029d";
const ONE_WEI = 10n ** 18n;

// --- NEW: VERIFICATION CONFIGURATION ---
const VERIFICATION_CONTRACT_ADDRESS =
  "0xEfdefe08C6cD74CFEB2f0CC2B9401c52B859B427";
const VERIFICATION_REQUEST_ID = 1985848453876781056n; // Use 'n' for bigint
// This is the off-chain Program ID needed to *get* verified
const VERIFICATION_PROGRAM_ID = "c21uo031mfijs02s18593h"; // Using ID from previous example

// --- END NEW ---

export const TradeCard = ({ market }: { market: Market }) => {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  const [tradeMode, setTradeMode] = React.useState("buy");
  const [outcome, setOutcome] = React.useState("yes");

  const [amountStr, setAmountStr] = React.useState("");
  const [amountWei, setAmountWei] = React.useState(0n);

  // --- WAGMI HOOKS ---
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { airService } = useAirkit(); // Get AirService

  // ... (buy, sell, approve hooks)
  const {
    data: buyHash,
    isPending: isBuying,
    writeContract: buy,
  } = useWriteContract();
  const {
    data: sellHash,
    isPending: isSelling,
    writeContract: sell,
  } = useWriteContract();
  const {
    data: approveHash,
    isPending: isApproving,
    writeContract: approve,
  } = useWriteContract();

  // ... (allowance, musdBalance, shareBalance hooks)
  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isAllowanceLoading,
  } = useReadContract({
    abi: erc20Abi,
    address: MUSD_TOKEN_ADDRESS,
    functionName: "allowance",
    args: [address!, PREDICTION_MARKET_ADDRESS],
    query: { enabled: isConnected && !!address },
  });
  const {
    data: musdBalance,
    refetch: refetchMusdBalance,
    isLoading: isBalanceLoading,
  } = useBalance({
    address: address,
    token: MUSD_TOKEN_ADDRESS,
    query: { enabled: isConnected && !!address },
  });
  const {
    data: sharesData,
    refetch: refetchShares,
    isLoading: isSharesLoading,
  } = useReadContract({
    abi: predictionMarketABI,
    address: PREDICTION_MARKET_ADDRESS,
    functionName: "getUserMarketShares",
    args: [BigInt(market.market_id), address!],
    query: { enabled: isConnected && !!address },
  });

  // --- NEW: VERIFICATION HOOKS ---
  // 4. On-chain check: Is the user verified?
  const {
    data: isVerified,
    refetch: refetchIsVerified,
    isLoading: isVerifyingOnChain,
  } = useReadContract({
    abi: verificationABI,
    address: VERIFICATION_CONTRACT_ADDRESS,
    functionName: "isProofVerified",
    args: [address!, VERIFICATION_REQUEST_ID],
    query: { enabled: isConnected && !!address },
  });

  // 5. Off-chain hook: The function to *start* verification
  const {
    verify,
    isVerifying: isVerifyingOffChain,
    isSuccess: isVerifySuccess,
    error: verifyError,
    reset: resetVerify,
  } = useCredentialVerification({
    programId: VERIFICATION_PROGRAM_ID,
    airService: airService,
  });

  // 6. Effect: When off-chain verification succeeds, refetch on-chain status
  React.useEffect(() => {
    if (isVerifySuccess) {
      refetchIsVerified();
    }
  }, [isVerifySuccess, refetchIsVerified]);
  // --- END NEW ---

  // ... (Price summary hooks)
  const outcomeId = React.useMemo(
    () => (outcome === "yes" ? 0n : 1n),
    [outcome]
  );
  const { data: currentPriceWei } = useReadContract({
    abi: predictionMarketABI,
    address: PREDICTION_MARKET_ADDRESS,
    functionName: "getMarketOutcomePrice",
    args: [BigInt(market.market_id), outcomeId],
    query: { enabled: isConnected },
  });
  const { data: sharesReceivedWei, isLoading: isCalculatingShares } =
    useReadContract({
      abi: predictionMarketABI,
      address: PREDICTION_MARKET_ADDRESS,
      functionName: "calcBuyAmount",
      args: [amountWei, BigInt(market.market_id), outcomeId],
      query: { enabled: isConnected && amountWei > 0n && tradeMode === "buy" },
    });
  const { data: feeWei } = useReadContract({
    abi: predictionMarketABI,
    address: PREDICTION_MARKET_ADDRESS,
    functionName: "getMarketBuyFee",
    args: [BigInt(market.market_id)],
    query: { enabled: isConnected },
  });

  // ... (useEffect hooks for refetching after txs)
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  React.useEffect(() => {
    if (isApproveSuccess) refetchAllowance();
  }, [isApproveSuccess, refetchAllowance]);

  const { isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buyHash,
  });
  const { isSuccess: isSellSuccess } = useWaitForTransactionReceipt({
    hash: sellHash,
  });
  React.useEffect(() => {
    if (isBuySuccess || isSellSuccess) {
      refetchMusdBalance();
      refetchShares();
    }
  }, [isBuySuccess, isSellSuccess, refetchMusdBalance, refetchShares]);

  // ... (Derived state for shares and trade details)
  const yesShares = React.useMemo(
    () => sharesData?.[1]?.[0] ?? 0n,
    [sharesData]
  );
  const noShares = React.useMemo(
    () => sharesData?.[1]?.[1] ?? 0n,
    [sharesData]
  );
  const selectedOutcomeShares = outcome === "yes" ? yesShares : noShares;
  const tradeDetails = React.useMemo(() => {
    const shares = sharesReceivedWei ?? 0n;
    const currentPrice = currentPriceWei ?? 0n;
    const avgPrice =
      amountWei > 0n && shares > 0n ? (amountWei * ONE_WEI) / shares : 0n;
    const maxPayout = shares;
    const maxProfit = shares > amountWei ? shares - amountWei : 0n;
    const maxProfitPercent =
      amountWei > 0n && maxProfit > 0n
        ? Number((maxProfit * 10000n) / amountWei) / 100
        : 0;
    const feePercent = feeWei ? Number(feeWei) / Number(10n ** 16n) : 0;
    return {
      currentPrice: parseFloat(formatEther(currentPrice)).toFixed(2),
      avgPrice: parseFloat(formatEther(avgPrice)).toFixed(2),
      shares: parseFloat(formatEther(shares)).toFixed(2),
      maxPayout: parseFloat(formatEther(maxPayout)).toFixed(2),
      maxProfit: parseFloat(formatEther(maxProfit)).toFixed(2),
      maxProfitPercent: maxProfitPercent.toFixed(2),
      feePercent: feePercent.toFixed(0),
    };
  }, [amountWei, sharesReceivedWei, currentPriceWei, feeWei]);

  // ... (Derived state for approval and balance)
  const needsApproval = React.useMemo(() => {
    if (tradeMode === "sell" || !isConnected) return false;
    if (allowance === undefined) return false;
    return allowance < amountWei;
  }, [tradeMode, isConnected, allowance, amountWei]);
  const hasSufficientBalance = React.useMemo(() => {
    if (amountWei === 0n) return true;
    if (tradeMode === "buy") {
      if (!musdBalance) return false;
      return musdBalance.value >= amountWei;
    }
    if (tradeMode === "sell") {
      if (sharesData === undefined) return false;
      return selectedOutcomeShares >= amountWei;
    }
    return true;
  }, [tradeMode, musdBalance, sharesData, amountWei, selectedOutcomeShares]);

  const isPending = isBuying || isSelling || isApproving;

  // ... (Event handlers are unchanged)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmountStr(val);
    try {
      if (val === "" || parseFloat(val) < 0) setAmountWei(0n);
      else setAmountWei(parseEther(val));
    } catch (error) {
      setAmountWei(0n);
    }
  };
  const handleApprove = () => {
    approve({
      abi: erc20Abi,
      address: MUSD_TOKEN_ADDRESS,
      functionName: "approve",
      args: [PREDICTION_MARKET_ADDRESS, maxUint256],
    });
  };
  const handleBuy = () => {
    buy({
      abi: predictionMarketABI,
      address: PREDICTION_MARKET_ADDRESS,
      functionName: "buy",
      args: [BigInt(market.market_id), outcomeId, 0n, amountWei],
    });
  };
  const handleSell = () => {
    sell({
      abi: predictionMarketABI,
      address: PREDICTION_MARKET_ADDRESS,
      functionName: "sell",
      args: [BigInt(market.market_id), outcomeId, amountWei, maxUint256],
    });
  };

  // --- RENDER ACTION BUTTON (UPDATED) ---
  const renderActionButton = () => {
    if (!isClient) {
      return (
        <Button size="lg" className="w-full h-12 text-base" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      );
    }
    if (isConnecting) {
      return (
        <Button size="lg" className="w-full h-12 text-base" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      );
    }
    if (!isConnected) {
      return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full h-12 text-base">
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    setIsModalOpen(false);
                  }}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {connector.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // --- NEW: VERIFICATION LOGIC ---
    if (isVerifyingOnChain) {
      return (
        <Button size="lg" className="w-full h-12 text-base" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Verification...
        </Button>
      );
    }
    if (isVerifyingOffChain) {
      return (
        <Button size="lg" className="w-full h-12 text-base" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying (Check Popup)
        </Button>
      );
    }
    // isVerified is false or undefined (if call failed)
    if (!isVerified) {
      return (
        <Button size="lg" className="w-full h-12 text-base" onClick={verify}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Verify to Trade
        </Button>
      );
    }
    // --- END NEW ---

    // --- User is Verified, proceed to normal logic ---

    if (isAllowanceLoading || isBalanceLoading || isSharesLoading) {
      return (
        <Button size="lg" className="w-full h-12 text-base" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Balances...
        </Button>
      );
    }

    // Handle "Buy" mode
    if (tradeMode === "buy") {
      if (isApproving)
        return (
          <Button size="lg" className="w-full h-12 text-base" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Approving...
          </Button>
        );
      if (isBuying)
        return (
          <Button size="lg" className="w-full h-12 text-base" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buying...
          </Button>
        );
      if (amountWei === 0n)
        return (
          <Button size="lg" className="w-full h-12 text-base" disabled>
            Enter an amount
          </Button>
        );
      if (!hasSufficientBalance)
        return (
          <Button
            size="lg"
            className="w-full h-12 text-base"
            variant="destructive"
            disabled
          >
            Insufficient MUSD Balance
          </Button>
        );
      if (needsApproval)
        return (
          <Button
            size="lg"
            className="w-full h-12 text-base"
            onClick={handleApprove}
            disabled={isPending}
          >
            Approve MUSD
          </Button>
        );
      return (
        <Button
          size="lg"
          className="w-full h-12 text-base"
          onClick={handleBuy}
          disabled={isPending}
          style={{
            backgroundColor:
              outcome === "yes" ? "rgb(6 182 212)" : "rgb(219 39 119)",
          }}
        >
          Buy {outcome === "yes" ? market.outcome_a : market.outcome_b}
        </Button>
      );
    }

    // Handle "Sell" mode
    if (tradeMode === "sell") {
      if (isSelling)
        return (
          <Button size="lg" className="w-full h-12 text-base" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Selling...
          </Button>
        );
      if (amountWei === 0n)
        return (
          <Button size="lg" className="w-full h-12 text-base" disabled>
            Enter an amount
          </Button>
        );
      if (!hasSufficientBalance)
        return (
          <Button
            size="lg"
            className="w-full h-12 text-base"
            variant="destructive"
            disabled
          >
            Insufficient Shares
          </Button>
        );
      return (
        <Button
          size="lg"
          className="w-full h-12 text-base"
          onClick={handleSell}
          disabled={isPending}
          style={{ backgroundColor: "rgb(100 116 139)" }}
        >
          Sell {outcome === "yes" ? market.outcome_a : market.outcome_b}
        </Button>
      );
    }
  };
  // --- END RENDER ACTION BUTTON ---

  return (
    <Card className="sticky top-8">
      <Tabs value={tradeMode} onValueChange={setTradeMode}>
        <CardHeader className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-4 pb-4">
          {/* ... (Progress Bar and Toggles) ... */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {market.yesPercentage}%
              </span>
              <span className="text-sm font-semibavold text-slate-800 dark:text-slate-200">
                {market.noPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-purple-500 to-pink-500" />
          </div>
          <ToggleGroup
            type="single"
            value={outcome}
            onValueChange={(val) => {
              if (val) setOutcome(val);
            }}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem
              value="yes"
              className="h-12 flex justify-between data-[state=on]:bg-cyan-100 data-[state=on]:text-cyan-900 border border-slate-200 dark:border-slate-700 data-[state=on]:border-cyan-300 dark:data-[state=on]:border-cyan-700"
            >
              <span>{market.outcome_a}</span>
              <span className="font-bold">
                ${parseFloat(formatEther(currentPriceWei ?? 0n)).toFixed(2)}
              </span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="no"
              className="h-12 flex justify-between data-[state=on]:bg-pink-100 data-[state=on]:text-pink-900 border border-slate-200 dark:border-slate-700 data-[state=on]:border-pink-300 dark:data-[state=on]:border-pink-700"
            >
              <span>{market.outcome_b}</span>
              <span className="font-bold">
                $
                {(1 - parseFloat(formatEther(currentPriceWei ?? 0n))).toFixed(
                  2
                )}
              </span>
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Amount Input */}
          <div className="relative">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="$0.00"
              className="h-12 text-base pr-20"
              min="0"
              step="0.01"
            />
            <span className="absolute right-4 top-[2.1rem] text-sm font-medium text-slate-500">
              MUSD
            </span>
            {isClient && isConnected && (
              <div className="absolute right-0 top-0 text-xs text-slate-500">
                Available:{" "}
                {musdBalance
                  ? `${parseFloat(formatEther(musdBalance.value)).toFixed(2)}`
                  : "0.00"}
              </div>
            )}
          </div>

          <Separator />

          {/* Price Summary */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Your Shares
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {isClient && isConnected
                  ? isSharesLoading
                    ? "..."
                    : parseFloat(formatEther(selectedOutcomeShares)).toFixed(4)
                  : "0.0000"}
              </span>
            </div>

            {tradeMode === "buy" && amountWei > 0n && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Price change
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {isCalculatingShares
                      ? "..."
                      : `$${tradeDetails.currentPrice} → $${tradeDetails.avgPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Shares
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {isCalculatingShares ? "..." : tradeDetails.shares}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Avg. price
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {isCalculatingShares ? "..." : `$${tradeDetails.avgPrice}`}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                Fee
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Trading fees go to liquidity providers.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {tradeDetails.feePercent}%
              </span>
            </div>

            {tradeMode === "buy" && amountWei > 0n && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Max profit
                  </span>
                  <span className="font-medium text-green-500">
                    {isCalculatingShares
                      ? "..."
                      : `$${tradeDetails.maxProfit} (+${tradeDetails.maxProfitPercent}%)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    Max payout
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Max payout is 1 share = $1 upon correct resolution.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {isCalculatingShares ? "..." : `$${tradeDetails.maxPayout}`}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* --- RENDER ACTION BUTTON --- */}
          {renderActionButton()}
          {/* --- END ACTION BUTTON --- */}
        </CardContent>
      </Tabs>

      <Separator />

      <CardFooter className="p-4">
        <TimelineCard market={market} />
      </CardFooter>
    </Card>
  );
};
