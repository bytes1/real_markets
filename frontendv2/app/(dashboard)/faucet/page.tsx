// app/faucet/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, CheckCircle, XCircle } from "lucide-react";
import { faucetABI } from "@/lib/abi/FaucetABI";

// --- TODO: ADD YOUR FAUCET CONTRACT ADDRESS ---
const FAUCET_CONTRACT_ADDRESS = "0x537534d1C34CCf351A6F317a35D07c724c0fb6ca"; // Your *new* Faucet contract address

// --- Sub-component for "Connect Wallet" Prompt ---
function ConnectWalletPrompt() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">MUSD Faucet</CardTitle>
          <CardDescription>
            Please connect your wallet (using the button in the header) to use
            the faucet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>You must be connected to claim tokens.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Faucet Page ---
export default function FaucetPage() {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  const { address, isConnected } = useAccount();

  // --- Transaction Hook ---
  const {
    data: hash,
    isPending,
    writeContract,
    error: writeError,
  } = useWriteContract();

  // --- Read Hook: Check if user has already claimed ---
  const {
    data: hasClaimed,
    isLoading: isClaimStatusLoading,
    refetch: refetchHasClaimed, // We'll call this after a successful claim
  } = useReadContract({
    abi: faucetABI,
    address: FAUCET_CONTRACT_ADDRESS,
    functionName: "hasClaimed",
    args: [address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // --- Wait for Transaction Receipt ---
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // --- Refetch claim status after success ---
  useEffect(() => {
    if (isSuccess) {
      refetchHasClaimed();
    }
  }, [isSuccess, refetchHasClaimed]);

  const handleClaim = () => {
    writeContract({
      abi: faucetABI,
      address: FAUCET_CONTRACT_ADDRESS,
      functionName: "requestTokens",
      args: [],
    });
  };

  // --- Render Logic ---

  // 1. Hydration loading state
  if (!isClient) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 2. Wallet not connected
  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  // 3. Main component render (Wallet is connected)
  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MUSD Faucet</CardTitle>
          <CardDescription>
            Get 100 MUSD tokens for testing. This is a one-time-only claim per
            address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleClaim}
            disabled={
              isClaimStatusLoading || isPending || isConfirming || hasClaimed
            }
            className="w-full h-12 text-base"
          >
            {isClaimStatusLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking status...
              </>
            ) : isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Check Wallet...
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : hasClaimed ? (
              "You have already claimed"
            ) : (
              "Claim 100 MUSD"
            )}
          </Button>

          {/* --- Success & Error Messages --- */}
          {isSuccess && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Claim Successful!</AlertTitle>
              <AlertDescription>
                100 MUSD has been sent to your wallet.
              </AlertDescription>
            </Alert>
          )}

          {/* Show contract-level error (e.g., "Already claimed") */}
          {writeError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Claim Failed</AlertTitle>
              <AlertDescription>
                {/* This will show the "Faucet: You have already claimed tokens" error */}
                {writeError.message.includes("Already claimed")
                  ? "You have already claimed your tokens."
                  : "An unknown error occurred."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
