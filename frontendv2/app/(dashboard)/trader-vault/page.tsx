// app/trader-vault/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useCredentialVerification } from "@/lib/hooks/useCredentialVerification";
import { useAirkit } from "@/lib/hooks/useAirkit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, ShieldCheck, XCircle } from "lucide-react";
import { verificationABI } from "@/lib/abi/VerificationABI";
import { traderVaultFactoryABI } from "@/lib/abi/TraderVaultFactoryABI";

// --- CONFIGURATION ---
const VERIFICATION_CONTRACT_ADDRESS =
  "0xEfdefe08C6cD74CFEB2f0CC2B9401c52B859B427";
const VERIFY_REQUEST_ID = 1986161362200793088n;
const VERIFICATION_PROGRAM_ID = "c21up0317b67m02v1859GL"; // Off-chain ID
const TRADER_VAULT_FACTORY_ADDRESS =
  "0x2B9b56E2dBbc7bd93B270EE4c680e2c8CF2356BE"; // Your deployed Factory address
// ---

// --- 1. Connect Wallet Prompt ---
function ConnectWalletPrompt() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          To create or manage a trader vault, you must first connect your
          wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" />
          <span>Use the Connect Wallet button in the header.</span>
        </div>
      </CardContent>
    </Card>
  );
}

// --- 2. Verification Prompt ---
function VerificationPrompt({
  onVerificationSuccess,
}: {
  onVerificationSuccess: () => void;
}) {
  const { airService } = useAirkit();
  const { verify, isVerifying, isSuccess, error, reset } =
    useCredentialVerification({
      programId: VERIFICATION_PROGRAM_ID,
      airService: airService,
    });

  // Effect to tell the parent page when off-chain verification is done
  useEffect(() => {
    if (isSuccess) {
      onVerificationSuccess();
    }
  }, [isSuccess, onVerificationSuccess]);

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Verification Required</CardTitle>
        <CardDescription>
          To create a trader vault, you must first prove you meet the
          requirements by verifying your credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={verify} disabled={isVerifying} className="w-full">
          {isVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4" />
          )}
          {isVerifying ? "Verifying..." : "Verify Credentials"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// --- 3. Create Vault Component ---
function CreateVault({ onVaultCreated }: { onVaultCreated: () => void }) {
  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleCreateVault = () => {
    writeContract({
      abi: traderVaultFactoryABI,
      address: TRADER_VAULT_FACTORY_ADDRESS,
      functionName: "createVault",
      args: [],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      onVaultCreated();
    }
  }, [isSuccess, onVaultCreated]);

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Your Vault</CardTitle>
        <CardDescription>
          You are verified! You can now create your own trader vault to manage
          investor funds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleCreateVault}
          disabled={isPending || isConfirming}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isPending
            ? "Check Wallet..."
            : isConfirming
            ? "Creating Vault..."
            : "Create Trader Vault"}
        </Button>
      </CardContent>
    </Card>
  );
}

// --- 4. Vault Management Dashboard ---
function VaultDashboard({ vaultAddress }: { vaultAddress: `0x${string}` }) {
  // TODO: Build out the dashboard
  // Here you would use `useReadContract` and `useWriteContract`
  // with the `traderVaultABI` and `vaultAddress` to:
  // - Show TVL (totalAssets)
  // - Show Investor list (balanceOf)
  // - Allow Deposits (deposit)
  // - Allow Trader to `tradeBuy` and `tradeSell`
  // - Allow Trader to `accrueFees` and `claimFees`

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>My Trader Vault</CardTitle>
        <CardDescription>
          Your vault is live! Manage your funds and investors here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-sm">Vault Address: {vaultAddress}</p>
        <p className="mt-4">(Build your vault management dashboard here)</p>
      </CardContent>
    </Card>
  );
}

// --- 5. Main Page Component ---
export default function TraderVaultPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const { address, isConnected } = useAccount();

  // Check 1: On-Chain Verification
  const {
    data: isVerified,
    isLoading: isVerificationLoading,
    refetch: refetchIsVerified,
  } = useReadContract({
    abi: verificationABI,
    address: VERIFICATION_CONTRACT_ADDRESS,
    functionName: "isProofVerified",
    args: [address!, VERIFY_REQUEST_ID],
    query: { enabled: isConnected && !!address },
  });

  // Check 2: Vault Existence
  const {
    data: vaultAddress,
    isLoading: isVaultLoading,
    refetch: refetchVaultAddress,
  } = useReadContract({
    abi: traderVaultFactoryABI,
    address: TRADER_VAULT_FACTORY_ADDRESS,
    functionName: "getVaultByTrader",
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  const isLoading = isVerificationLoading || isVaultLoading;

  // Render logic
  const renderContent = () => {
    if (!isConnected) {
      return <ConnectWalletPrompt />;
    }
    if (isLoading) {
      return <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />;
    }

    // Check if a vault exists first
    const vaultExists =
      vaultAddress &&
      vaultAddress !== "0x0000000000000000000000000000000000000000";
    if (vaultExists) {
      return <VaultDashboard vaultAddress={vaultAddress} />;
    }

    // If no vault, check verification
    if (!isVerified) {
      return <VerificationPrompt onVerificationSuccess={refetchIsVerified} />;
    }

    // Verified, but no vault
    return <CreateVault onVaultCreated={refetchVaultAddress} />;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold">Trader Vaults</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create your own vault, raise investor funds, and earn a 30%
          performance fee on profits.
        </p>
      </div>
      <div className="mt-10">
        {isClient ? (
          renderContent()
        ) : (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
