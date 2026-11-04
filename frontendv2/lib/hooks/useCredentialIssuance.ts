import { AirService } from "@mocanetwork/airkit";
import { useState, useCallback } from "react";
// Import values as constants
import {
  partnerId,
  privateKey,
  kid,
  jwtAlgorithm,
  REDIRECT_URL,
} from "@/lib/utils/constants";
import { generateJwt } from "@/lib/utils/jwt";

// Define the data type for the credential subject
type JsonDocumentObject = Record<string, string | number | boolean>;

/**
 * Props required by the credential issuance hook.
 */
interface UseCredentialIssuanceProps {
  airService: AirService | null; // Expect airService as a prop
  issuerDid: string;
  credentialId: string;
}

/**
 * A hook to encapsulate the logic for issuing an AIR credential.
 */
export const useCredentialIssuance = ({
  airService, // Get airService from props
  issuerDid,
  credentialId,
}: UseCredentialIssuanceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * The main function to call for issuing a credential.
   */
  const issueCredential = useCallback(
    async (credentialSubject: JsonDocumentObject) => {
      // 1. Reset state and set loading
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        // 2. Generate the JWT using imported constants
        const jwt = await generateJwt({
          partnerId,
          privateKey,
          kid,
          jwtAlgorithm,
        });

        if (!jwt) {
          throw new Error("Failed to generate JWT");
        }

        // 3. Check for AirService
        if (!airService) {
          throw new Error(
            "AirService is not initialized. Please check your partner ID."
          );
        }

        // 4. Check for empty subject
        if (Object.keys(credentialSubject).length === 0) {
          throw new Error("Credential Subject cannot be empty.");
        }

        // 5. Call the AirService
        await airService.issueCredential({
          authToken: jwt,
          credentialId: credentialId,
          credentialSubject: credentialSubject,
          issuerDid: issuerDid,
        });

        // 6. Set success
        setIsSuccess(true);
      } catch (err) {
        // 7. Handle errors
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        // 8. Stop loading
        setIsLoading(false);
      }
    },
    [
      // Dependencies
      airService,
      issuerDid,
      credentialId,
    ]
  );

  /**
   * Function to reset the status
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  // Expose the function and the state
  return { issueCredential, isLoading, isSuccess, error, reset };
};
