import { useState, useCallback } from "react";
import { AirService } from "@mocanetwork/airkit"; // Import the type
import { generateJwt } from "@/lib/utils/jwt";
import {
  partnerId,
  privateKey,
  kid,
  jwtAlgorithm,
  REDIRECT_URL,
} from "@/lib/utils/constants";

interface UseVerificationProps {
  programId: string;
  airService: AirService | null; // Expect airService as a prop
}

export const useCredentialVerification = ({
  programId,
  airService, // Get airService from props
}: UseVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const verify = useCallback(async () => {
    if (!airService) {
      setError("AirService is not initialized.");
      return;
    }
    if (!programId) {
      setError("No Program ID provided.");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Step 1: Generate JWT
      const jwt = await generateJwt({
        partnerId,
        privateKey,
        kid,
        jwtAlgorithm,
      });
      if (!jwt) throw new Error("Failed to generate JWT");

      // Step 2: Off-chain verification
      const result = await airService.verifyCredential({
        authToken: jwt,
        programId: programId,
        redirectUrl: REDIRECT_URL,
      });

      console.log("Verification Result:", result);
      if (result.status !== "Compliant") {
        throw new Error(
          `Credential verification failed. Status: ${result.status}`
        );
      }

      // Step 3: Set success
      setIsSuccess(true);
      alert("Credential Verified Successfully!");
    } catch (err: unknown) {
      console.error("Verification failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsVerifying(false);
    }
  }, [airService, programId]); // Use airService from props

  const reset = useCallback(() => {
    setIsVerifying(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    isVerifying,
    isSuccess,
    error,
    verify,
    reset,
  };
};
