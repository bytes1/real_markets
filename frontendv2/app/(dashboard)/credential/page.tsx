"use client";

import React, { useState, useEffect } from "react";
import { CredentialCard } from "@/components/CredentialCard"; // Adjusted path to match convention
import { Credentialvault } from "@/components/Credentialvault";
import { useAccount } from "wagmi";
import { Loader2, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardData = {
  title: "True Markets user verification",
  points: 150,
  description: "provides user age and location",
  issuer: "True Markets",
  category: "Verification",

  issuanceCredentialId: "c21uo0g1iaxx40284399Vz", // The ID of the credential to issue
  issuerDid: "did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM", // Your issuer DID
};
const cardData2 = {
  title: "True Markets user  trade verification",
  points: 15,
  description: "Provides user trade volume",
  issuer: "True Markets",
  category: "Verification",

  issuanceCredentialId: "c21up0g179ls202c2067vE", // The ID of the credential to issue
  issuerDid: "did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM", // Your issuer DID
};

// --- NEW: Component to show when wallet is not connected ---
function ConnectWalletPrompt() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Request Credentials</CardTitle>
          <CardDescription>
            Please connect your wallet to view and request credentials.
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

export default function RequestCredentialsPage() {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  const { isConnected } = useAccount();

  // 1. Show a loader during hydration
  if (!isClient) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 2. Show "Connect Wallet" prompt
  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  // 3. Show the main page content
  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Request Credentials</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Connect your data sources and request verifiable credentials to
            build your credit score
          </p>
        </header>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CredentialCard
            title={cardData.title}
            points={cardData.points}
            description={cardData.description}
            issuer={cardData.issuer}
            category={cardData.category}
            // --- PASS PROPS ---
            issuanceCredentialId={cardData.issuanceCredentialId}
            issuerDid={cardData.issuerDid}
          />

          {/* You can add the other cards here */}
          <Credentialvault
            title={cardData2.title}
            points={cardData2.points}
            description={cardData2.description}
            issuer={cardData2.issuer}
            category={cardData2.category}
            // --- PASS PROPS ---
            issuanceCredentialId={cardData2.issuanceCredentialId}
            issuerDid={cardData2.issuerDid}
          />
        </div>
      </div>
    </div>
  );
}
