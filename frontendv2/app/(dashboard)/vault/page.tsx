// app/vault/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther, parseEther, maxUint256, erc20Abi } from "viem";
import { vaultABI } from "@/lib/abi/VaultABI";
import { Loader2, Wallet, CheckCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- TODO: CONFIGURE YOUR ADDRESSES ---
const MUSD_TOKEN_ADDRESS = "0xE73559ce9FD6dde324210A4D250610F41728029d";
const VAULT_CONTRACT_ADDRESS = "0xFb316613d7ab8052e4EF856Ed0825A32e12B1E30"; // Your new AI Vault contract address
// ---

export default function VaultPage() {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  const [activeTab, setActiveTab] = useState("deposit");
  const [amountStr, setAmountStr] = useState("");
  const [amountWei, setAmountWei] = useState(0n);

  // --- WAGMI HOOKS ---
  const { address, isConnected } = useAccount();

  // Write hooks
  const {
    data: approveHash,
    isPending: isApproving,
    writeContract: approve,
  } = useWriteContract();
  const {
    data: depositHash,
    isPending: isDepositing,
    writeContract: deposit,
  } = useWriteContract();
  const {
    data: withdrawHash,
    isPending: isWithdrawing,
    writeContract: withdraw,
  } = useWriteContract();

  // Read: User's mUSD (wallet) balance
  const { data: musdBalance, refetch: refetchMusdBalance } = useBalance({
    address,
    token: MUSD_TOKEN_ADDRESS,
    query: { enabled: isConnected },
  });

  // Read: User's vault shares (staked balance)
  const { data: vaultShares, refetch: refetchVaultShares } = useReadContract({
    abi: vaultABI,
    address: VAULT_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: isConnected },
  });

  // Read: Convert vault shares to mUSD value
  const { data: stakedValue, refetch: refetchStakedValue } = useReadContract({
    abi: vaultABI,
    address: VAULT_CONTRACT_ADDRESS,
    functionName: "convertToAssets",
    args: [vaultShares ?? 0n],
    query: { enabled: isConnected && vaultShares !== undefined },
  });

  // Read: Total Value Locked (TVL) in the vault
  const { data: tvl, refetch: refetchTvl } = useReadContract({
    abi: vaultABI,
    address: VAULT_CONTRACT_ADDRESS,
    functionName: "totalAssets",
    query: { enabled: isConnected },
  });

  // Read: mUSD allowance for the vault
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: MUSD_TOKEN_ADDRESS,
    functionName: "allowance",
    args: [address!, VAULT_CONTRACT_ADDRESS],
    query: { enabled: isConnected },
  });

  // --- Wait for transactions to update UI ---
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });
  const { isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  // Refetch data after approval
  useEffect(() => {
    if (isApproveSuccess) refetchAllowance();
  }, [isApproveSuccess, refetchAllowance]);

  // Refetch data after deposit or withdraw
  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess) {
      refetchMusdBalance();
      refetchVaultShares();
      refetchStakedValue();
      refetchTvl();
      setAmountStr("");
      setAmountWei(0n);
    }
  }, [
    isDepositSuccess,
    isWithdrawSuccess,
    refetchMusdBalance,
    refetchVaultShares,
    refetchStakedValue,
    refetchTvl,
  ]);

  // --- DERIVED STATE ---
  const isPending = isApproving || isDepositing || isWithdrawing;

  const needsApproval = React.useMemo(() => {
    if (activeTab === "withdraw" || !isConnected || allowance === undefined)
      return false;
    return allowance < amountWei;
  }, [activeTab, isConnected, allowance, amountWei]);

  const hasSufficientBalance = React.useMemo(() => {
    if (amountWei === 0n) return true;
    if (activeTab === "deposit") {
      return musdBalance ? musdBalance.value >= amountWei : false;
    }
    if (activeTab === "withdraw") {
      return stakedValue ? stakedValue >= amountWei : false;
    }
    return true;
  }, [activeTab, musdBalance, stakedValue, amountWei]);

  // --- HANDLERS ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmountStr(val);
    try {
      if (val === "" || parseFloat(val) < 0) {
        setAmountWei(0n);
      } else {
        setAmountWei(parseEther(val));
      }
    } catch (error) {
      console.warn("Invalid number input");
      setAmountWei(0n);
    }
  };

  const handleSetMax = () => {
    if (activeTab === "deposit") {
      if (musdBalance) {
        setAmountStr(formatEther(musdBalance.value));
        setAmountWei(musdBalance.value);
      }
    } else {
      // Withdraw
      if (stakedValue) {
        setAmountStr(formatEther(stakedValue));
        setAmountWei(stakedValue);
      }
    }
  };

  const handleApprove = () => {
    approve({
      abi: erc20Abi,
      address: MUSD_TOKEN_ADDRESS,
      functionName: "approve",
      args: [VAULT_CONTRACT_ADDRESS, maxUint256],
    });
  };

  const handleDeposit = () => {
    deposit({
      abi: vaultABI,
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "deposit",
      args: [amountWei, address!],
    });
  };

  const handleWithdraw = () => {
    // Note: This withdraws a specific *amount* of mUSD.
    // If your vault's `withdraw` function takes *shares*, you'll need to
    // call `convertToShares` first. This logic assumes `withdraw` takes assets.
    // For simplicity, we are assuming 1 share = 1 asset.
    // In a real vault, you'd withdraw shares: `args: [amountWei, address!, address!]`
    withdraw({
      abi: vaultABI,
      address: VAULT_CONTRACT_ADDRESS,
      functionName: "withdraw",
      args: [amountWei, address!, address!], // (assets, receiver, owner)
    });
  };

  // --- RENDER LOGIC ---

  // 1. Hydration loading state
  if (!isClient) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 2. Wallet not connected prompt
  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">AI-Native Vault</CardTitle>
            <CardDescription>
              Please connect your wallet to interact with the yield agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>Use the Connect Wallet button in the header.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Main Page
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Description */}
        <div className="space-y-4 pt-2">
          <h1 className="text-3xl font-bold">Autonomous Yield Agent</h1>
          <p className="text-lg text-muted-foreground">
            A fully automated, AI-native DeFi layer. Deposit your mUSD and let
            our AI-managed strategies optimize your yield passively.
          </p>
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                This agent establishes the foundation for a fully automated
                AI-native DeFi layer.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Multi-strategy yield routing & automated harvesting</li>
                <li>Continuous monitoring of yield-bearing DeFi pools</li>
                <li>Real-time decision engine for capital re-allocation</li>
                <li>Compounding and low-risk optimization logic</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Vault Interaction Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>mUSD Yield Vault</CardTitle>
            <CardDescription>
              Deposit mUSD to start earning. Withdraw anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">APY</div>
                <div className="text-lg font-bold text-green-500">12.5%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">TVL</div>
                <div className="text-lg font-bold">
                  ${tvl ? parseFloat(formatEther(tvl)).toFixed(2) : "0.00"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">My Balance</div>
                <div className="text-lg font-bold">
                  $
                  {stakedValue
                    ? parseFloat(formatEther(stakedValue)).toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>

              {/* --- DEPOSIT TAB --- */}
              <TabsContent value="deposit">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="deposit" className="text-sm font-medium">
                      Amount
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Available:{" "}
                      {musdBalance
                        ? parseFloat(formatEther(musdBalance.value)).toFixed(2)
                        : "0.00"}{" "}
                      MUSD
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="deposit"
                      type="number"
                      value={amountStr}
                      onChange={handleAmountChange}
                      placeholder="0.0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                      onClick={handleSetMax}
                    >
                      Max
                    </Button>
                  </div>

                  {/* Action Button Logic */}
                  {isApproving ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </Button>
                  ) : isDepositing ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Depositing...
                    </Button>
                  ) : needsApproval ? (
                    <Button
                      className="w-full"
                      onClick={handleApprove}
                      disabled={!hasSufficientBalance || amountWei === 0n}
                    >
                      {!hasSufficientBalance
                        ? "Insufficient Balance"
                        : "Approve mUSD"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleDeposit}
                      disabled={
                        !hasSufficientBalance || amountWei === 0n || isPending
                      }
                    >
                      {!hasSufficientBalance
                        ? "Insufficient Balance"
                        : "Deposit"}
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* --- WITHDRAW TAB --- */}
              <TabsContent value="withdraw">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="withdraw" className="text-sm font-medium">
                      Amount
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Available:{" "}
                      {stakedValue
                        ? parseFloat(formatEther(stakedValue)).toFixed(2)
                        : "0.00"}{" "}
                      MUSD
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="withdraw"
                      type="number"
                      value={amountStr}
                      onChange={handleAmountChange}
                      placeholder="0.0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                      onClick={handleSetMax}
                    >
                      Max
                    </Button>
                  </div>

                  {/* Action Button Logic */}
                  {isWithdrawing ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing...
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleWithdraw}
                      disabled={
                        !hasSufficientBalance || amountWei === 0n || isPending
                      }
                    >
                      {!hasSufficientBalance
                        ? "Insufficient Balance"
                        : "Withdraw"}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Success/Error Alerts */}
            {isDepositSuccess && (
              <Alert variant="default">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Deposit Successful</AlertTitle>
              </Alert>
            )}
            {isWithdrawSuccess && (
              <Alert variant="default">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Withdrawal Successful</AlertTitle>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 mr-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>All funds are managed by the automated AI agent.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Yields are not guaranteed. Use at your own risk.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
