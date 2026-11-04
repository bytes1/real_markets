// // app/test-transaction/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   useAccount,
//   useSendTransaction,
//   useWaitForTransactionReceipt,
//   useBalance,
// } from "wagmi";
// import { parseEther, formatEther } from "viem";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useCredentialIssuance } from "@lib/hooks/useCredentialIssuance";
// import { useAirkit } from "@/lib/hooks/useAirkit";

// // A safe default address (the "zero address")
// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
// const issuer_did="did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM";
// const cred_id="c21uo0g1iaxx40284399Vz";

// export default function TestTransactionPage() {
//   // --- Hydration Fix ---
//   const [isClient, setIsClient] = useState(false);
//    const { airService, isInitialized } = useAirkit();
//    const { issueCredential, isLoading, isSuccess, error } = useCredentialIssuance({
//     airService,
//     issuer_did,
//     cred_id
//   });
//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setIsClient(true);
//   }, []);
//   // --- End Hydration Fix ---

//   // --- Wallet State ---
//   const { address, isConnected } = useAccount();
//   const { data: balanceData } = useBalance({
//     address,
//   });

//   // --- Form State ---
//   const [toAddress, setToAddress] = useState("");
//   const [amount, setAmount] = useState("0.001");

//   // --- Transaction Hooks ---
//   const {
//     data: hash,
//     isPending,
//     sendTransaction,
//     error: sendError,
//   } = useSendTransaction();

//   const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
//     hash,
//   });

//   const handleSendTransaction = () => {
//     if (!toAddress || !amount) {
//       alert("Please fill in both address and amount.");
//       return;
//     }
//     sendTransaction({
//       to: toAddress as `0x${string}`,
//       value: parseEther(amount),
//     });
//   };

//   // --- Render Logic ---

//   // 1. Wait for client to mount (prevents hydration errors)
//   if (!isClient) {
//     return (
//       <div className="p-4 md:p-8">
//         <Card className="max-w-md mx-auto">
//           <CardHeader>
//             <CardTitle>Loading Transaction Tester...</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Button disabled className="w-full">
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Loading...
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // 2. Wallet not connected
//   if (!isConnected) {
//     return (
//       <div className="p-4 md:p-8">
//         <Card className="max-w-md mx-auto">
//           <CardHeader>
//             <CardTitle>Wallet Not Connected</CardTitle>
//             <CardDescription>
//               Please connect your wallet (using the button in the header) to use
//               the transaction tester.
//             </CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }

//   // 3. Main component render
//   return (
//     <div className="p-4 md:p-8">
//       <Card className="max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Simple Transaction Tester</CardTitle>
//           <CardDescription>
//             Send a small amount of native currency (e.g., ETH) to test your
//             wallet connection.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="text-sm">
//             <p className="font-medium">Your Address:</p>
//             <p className="font-mono text-xs break-all">{address}</p>
//           </div>
//           <div className="text-sm">
//             <p className="font-medium">Your Balance:</p>
//             <p className="font-mono text-xs">
//               {balanceData
//                 ? `${formatEther(balanceData.value)} ${balanceData.symbol}`
//                 : "Loading..."}
//             </p>
//           </div>

//           <Separator />

//           <div>
//             <label
//               htmlFor="toAddress"
//               className="block text-sm font-medium mb-1"
//             >
//               Recipient Address
//             </label>
//             <Input
//               id="toAddress"
//               value={toAddress}
//               onChange={(e) => setToAddress(e.target.value)}
//               placeholder={ZERO_ADDRESS}
//             />
//           </div>

//           <div>
//             <label htmlFor="amount" className="block text-sm font-medium mb-1">
//               Amount (e.g., `0.001`)
//             </label>
//             <Input
//               id="amount"
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               step="0.001"
//               min="0"
//             />
//           </div>

//           <Button
//             onClick={handleSendTransaction}
//             disabled={
//               isPending ||
//               isConfirming ||
//               !toAddress ||
//               !amount ||
//               toAddress === ZERO_ADDRESS
//             }
//             className="w-full"
//           >
//             {isPending || isConfirming ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {isConfirming
//                   ? "Waiting for confirmation..."
//                   : "Check Wallet..."}
//               </>
//             ) : (
//               "Send Transaction"
//             )}
//           </Button>
//         </CardContent>

//         <CardFooter>
//           <div className="w-full space-y-4">
//             {hash && (
//               <Alert>
//                 <AlertTitle>Transaction Sent</AlertTitle>
//                 <AlertDescription className="text-xs break-all">
//                   Hash: {hash}
//                   {/* TODO: Replace with your chain's block explorer */}
//                   <a
//                     href={`https://etherscan.io/tx/${hash}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block text-blue-500 hover:underline mt-1"
//                   >
//                     View on Etherscan
//                   </a>
//                 </AlertDescription>
//               </Alert>
//             )}
//             {isSuccess && (
//               <Alert variant="default">
//                 <AlertTitle>Transaction Confirmed!</AlertTitle>
//               </Alert>
//             )}
//             {sendError && (
//               <Alert variant="destructive">
//                 <AlertTitle>Error</AlertTitle>
//                 <AlertDescription className="text-xs break-all">
//                   {sendError.message}
//                 </AlertDescription>
//               </Alert>
//             )}
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// // You will also need this shadcn component
// function Separator() {
//   return <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-700" />;
// }
"use client";

//
// import React, { useState } from "react";
// import { useCredentialIssuance } from "@/lib/hooks/useCredentialIssuance"; // Adjust this path
// import { useAirkit } from "@/lib/hooks/useAirkit";

// /**
//  * Props for our example component.
//  * In a real app, you might get 'airService' from a React Context.
//  */

// const ExampleIssuer = () => {
//   // --- 1. Define your specific issuance info ---
//   // This info could come from props, state, or constants
//   const { airService, isInitialized } = useAirkit();
//   const [issuerDid, setIssuerDid] = useState(
//     "did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM"
//   );
//   const [credentialId, setCredentialId] = useState("c21uo0g1iaxx40284399Vz");

//   // --- 2. Call the hook with the required config ---
//   const { issueCredential, isLoading, isSuccess, error, reset } =
//     useCredentialIssuance({
//       airService,
//       issuerDid,
//       credentialId,
//     });

//   // --- 3. Create a function to trigger the issuance ---
//   const handleIssueClick = () => {
//     // This is the data you want to put *inside* the credential
//     const credentialSubject = {
//       id: Date.now().toString(),
//       age: 21,
//       location: "india",
//     };

//     // Call the function returned from the hook
//     issueCredential(credentialSubject);
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
//       <h3>My Credential Issuer</h3>
//       <p>
//         This component will issue a credential with a fixed username, level, and
//         status.
//       </p>

//       {/* --- 4. Use the returned state to update your UI --- */}
//       <button onClick={handleIssueClick} disabled={isLoading}>
//         {isLoading ? "Issuing..." : "Issue 'johndoe' Credential"}
//       </button>

//       {isSuccess && (
//         <div style={{ color: "green", marginTop: "10px" }}>
//           ✅ Credential issued successfully!
//           <button onClick={reset} style={{ marginLeft: "10px" }}>
//             Reset
//           </button>
//         </div>
//       )}

//       {error && (
//         <div style={{ color: "red", marginTop: "10px" }}>
//           <p>
//             <strong>Error:</strong> {error}
//           </p>
//           <button onClick={reset}>Try Again</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExampleIssuer;

"use client";

// import React, { useState, useEffect } from "react";
// // Import both of your custom hooks
// import { useCredentialIssuance } from "@/lib/hooks/useCredentialIssuance";
// import { useCredentialVerification } from "@/lib/hooks/useCredentialVerification";
// // UI Components
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription, // Added for clarity
// } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Loader2, CheckCircle, XCircle } from "lucide-react";
// import { useAccount } from "wagmi";
// import { useAirkit } from "@/lib/hooks/useAirkit";

// const VerifyAndIssuePage = () => {
//   // --- 1. Setup Verification Hook ---
//   // This is the credential we are CHECKING (e.g., "Bank Balance - High")
//   const { airService, isInitialized } = useAirkit();
//   const [verificationProgramId, setVerificationProgramId] = useState(
//     "c21pp030oeirj0051859o0" // Your reference Program ID
//   );
//   const {
//     verify,
//     isVerifying,
//     isSuccess: isVerifySuccess,
//     error: verifyError,
//     reset: resetVerify,
//   } = useCredentialVerification({
//     programId: verificationProgramId,
//   });

//   // --- 2. Setup Issuance Hook ---
//   // This is the NEW credential we are ISSUING
//   const [issuerDid, setIssuerDid] = useState(
//     "did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM"
//   );
//   const [issuanceCredentialId, setIssuanceCredentialId] = useState(
//     "c21uo031mfijs02s18593h" // The Program ID you provided
//   );
//   const {
//     issueCredential,
//     isLoading: isIssuing,
//     isSuccess: isIssueSuccess,
//     error: issueError,
//     reset: resetIssue,
//   } = useCredentialIssuance({
//     airService,
//     issuerDid,
//     credentialId: issuanceCredentialId,
//   });

//   // --- 3. Chaining Logic ---
//   const [isChaining, setIsChaining] = useState(false);
//   const { address } = useAccount(); // Get address for the new credential

//   // This effect watches for verification success to trigger issuance
//   useEffect(() => {
//     // Only run if we are in "chaining" mode and verification just succeeded
//     if (isChaining && isVerifySuccess) {
//       console.log("Verification successful! Now issuing credential...");

//       // Define the subject data for the *new* credential
//       const credentialSubject = {
//         id: Date.now().toString(),
//         age: 21,
//         location: "india",
//       };

//       // Call the second hook's function
//       issueCredential(credentialSubject);

//       // Stop the chaining process
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setIsChaining(false);
//     }
//   }, [isVerifySuccess, isChaining, issueCredential, address]);

//   // --- 4. Combined Handler & State ---
//   const handleProcessClick = () => {
//     // Reset both hooks in case of a previous error
//     resetVerify();
//     resetIssue();
//     // Start the chain
//     setIsChaining(true);
//     // Kick off the first step: verification
//     verify();
//   };

//   const isLoading = isVerifying || isIssuing || isChaining;
//   const displayError = verifyError || issueError;

//   return (
//     <div className="p-4 md:p-8">
//       <Card className="max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Verify & Issue Credential</CardTitle>
//           <CardDescription>
//             This process will first verify your existing credentials, then issue
//             a new Verified User credential to your wallet.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Button
//             onClick={handleProcessClick}
//             disabled={isLoading}
//             className="w-full"
//           >
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {isVerifying
//               ? "Step 1: Verifying..."
//               : isIssuing
//               ? "Step 2: Issuing..."
//               : isIssueSuccess
//               ? "Process Complete"
//               : "Verify & Issue"}
//           </Button>

//           {isIssueSuccess && (
//             <Alert variant="default">
//               <CheckCircle className="h-4 w-4" />
//               <AlertTitle>Success!</AlertTitle>
//               <AlertDescription>
//                 Verification and issuance were both successful.
//               </AlertDescription>
//             </Alert>
//           )}

//           {displayError && (
//             <Alert variant="destructive">
//               <XCircle className="h-4 w-4" />
//               <AlertTitle>Process Failed</AlertTitle>
//               <AlertDescription>{displayError}</AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default VerifyAndIssuePage;

"use client";

"use client";

import React, { useState, useEffect } from "react";
// Import both of your custom hooks
import { useCredentialIssuance } from "@/lib/hooks/useCredentialIssuance";
import { useCredentialVerification } from "@/lib/hooks/useCredentialVerification";
// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { useAirkit } from "@/lib/hooks/useAirkit";

const VerifyAndIssuePage = () => {
  // --- 1. Get AirService from context ---
  const { airService } = useAirkit();
  // --- 2. Setup Verification Hook ---
  const [verificationProgramId, setVerificationProgramId] = useState(
    "c21uo031mfijs02s18593h" // Your reference Program ID
  );
  const {
    verify,
    isVerifying,
    isSuccess: isVerifySuccess,
    error: verifyError,
    reset: resetVerify,
  } = useCredentialVerification({
    programId: verificationProgramId,
    airService: airService,
  });

  // --- 3. Setup Issuance Hook ---
  const [issuerDid, setIssuerDid] = useState(
    "did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM"
  );
  const [issuanceCredentialId, setIssuanceCredentialId] = useState(
    "c21uo0g1iaxx40284399Vz" // The Program ID you provided
  );
  const {
    issueCredential,
    isLoading: isIssuing,
    isSuccess: isIssueSuccess,
    error: issueError,
    reset: resetIssue,
  } = useCredentialIssuance({
    issuerDid,
    credentialId: issuanceCredentialId,
    airService: airService,
  });

  // --- 4. Get Address ---
  const { address } = useAccount(); // Get address for the new credential

  // --- 5. Separate Handlers ---
  const handleVerifyClick = () => {
    // Reset only the verification hook
    resetVerify();
    verify();
  };

  const handleIssueClick = () => {
    // Reset only the issuance hook
    resetIssue();
    const credentialSubject = {
      id: Date.now().toString(),
      age: 23,
      location: "india",
    };
    issueCredential(credentialSubject);
  };

  const displayError = verifyError || issueError;

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify & Issue Credential</CardTitle>
          <CardDescription>
            Request a verification or issue a new credential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* --- Button 1: Verify --- */}
          <Button
            onClick={handleVerifyClick}
            disabled={isVerifying} // Only disable if this action is in progress
            className="w-full"
            variant="outline"
          >
            {isVerifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              !isVerifySuccess && <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {isVerifySuccess
              ? "Verified Successfully"
              : isVerifying
              ? "Verifying..."
              : "Verify Credential"}
          </Button>

          {/* --- Button 2: Issue --- */}
          <Button
            onClick={handleIssueClick}
            disabled={isIssuing} // Only disable if this action is in progress
            className="w-full"
          >
            {isIssuing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              !isIssueSuccess && <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {isIssueSuccess
              ? "Issued Successfully"
              : isIssuing
              ? "Issuing..."
              : "Issue Credential"}
          </Button>

          {/* --- Status Messages --- */}
          {/* Show a separate success message for each action */}
          {isVerifySuccess && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Verification Successful!</AlertTitle>
            </Alert>
          )}

          {isIssueSuccess && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Issuance Successful!</AlertTitle>
            </Alert>
          )}

          {displayError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Process Failed</AlertTitle>
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAndIssuePage;
