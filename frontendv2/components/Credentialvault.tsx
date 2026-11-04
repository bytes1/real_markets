"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
// --- FIX: Use relative paths ---
import { useCredentialIssuance } from "@/lib/hooks/useCredentialIssuance";
import { useAirkit } from "@/lib/hooks/useAirkit";
// --- END FIX ---
import { useAccount } from "wagmi";

// Define the props for the card
interface CredentialCardProps {
  title: string;
  points: number;
  description: string;
  issuer: string;
  category: string;
  issuanceCredentialId: string; // ID of the credential to issue
  issuerDid: string; // DID of the issuer
}

export const Credentialvault = ({
  title,
  points,
  description,
  issuer,
  category,
  issuanceCredentialId,
  issuerDid,
}: CredentialCardProps) => {
  const { address } = useAccount();
  const { airService } = useAirkit();

  // Call the issuance hook
  const {
    issueCredential,
    isLoading: isIssuing,
    isSuccess: isIssueSuccess,
    error: issueError,
    reset: resetIssue,
  } = useCredentialIssuance({
    airService,
    issuerDid,
    credentialId: issuanceCredentialId,
  });

  const handleRequest = async () => {
    // Reset state in case of retry
    resetIssue();

    // Define the subject data for the new credential
    const credentialSubject = {
      id: Date.now().toString(),
      Trade_volume: 30000000,
    };

    // Call the function from the hook
    await issueCredential(credentialSubject);
  };

  return (
    <Card className="w-full max-w-sm shadow-md flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <Badge variant="default">{points}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Separator />
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Issuer:</span> {issuer}
          </p>
          <p>
            <span className="text-muted-foreground">Category:</span> {category}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button
          variant="default"
          className="w-full"
          onClick={handleRequest}
          disabled={isIssuing || isIssueSuccess}
        >
          {isIssuing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isIssuing
            ? "Issuing..."
            : isIssueSuccess
            ? "Credential Issued"
            : "Request Credential"}
        </Button>
        {isIssueSuccess && (
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Credential has been issued to your wallet.
            </AlertDescription>
          </Alert>
        )}
        {issueError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Issuance Failed</AlertTitle>
            <AlertDescription className="text-xs">
              {issueError}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};
