// frontend/src/contexts/AirServiceContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AirService } from "@mocanetwork/airkit";
import { useAccount } from "wagmi"; // <-- Import the useAccount hook

// It's best practice to get this from an environment variable
// but for now, we can keep it here for testing.
const PARTNER_ID = "8a222988-f7f8-42d3-9b39-543d93d6fb16";

// 1. Create the context
const AirServiceContext = createContext<AirService | null>(null);

// 2. Create the provider component
export const AirServiceProvider = ({ children }: { children: ReactNode }) => {
  // Get wallet connection status from wagmi's useAccount hook
  const { isConnected } = useAccount();
  const [airService, setAirService] = useState<AirService | null>(null);

  useEffect(() => {
    // Define an async function inside the effect to handle initialization
    const initializeService = async () => {
      if (!PARTNER_ID) {
        console.error("VITE_MOCA_PARTNER_ID is not set.");
        return;
      }

      console.log("Initializing AirService with Partner ID...");

      // First, create the service instance
      const service = new AirService({ partnerId: PARTNER_ID });

      // Then, call the async init method
      await service.init({
        buildEnv: "sandbox",
        enableLogging: true,
        skipRehydration: false,
      });

      console.log("AirService initialized:", service);
      setAirService(service);
    };

    // --- MODIFICATION START ---
    // Check if the wallet is connected AND the service has not been initialized yet.
    if (isConnected && !airService) {
      initializeService();
    }
    // Optional, but good practice: Clean up the service if the user disconnects.
    else if (!isConnected && airService) {
      console.log("User disconnected, cleaning up AirService.");
      setAirService(null);
    }
    // --- MODIFICATION END ---

    // Rerun this effect whenever the connection status or the airService instance changes.
  }, [isConnected, airService]);

  return (
    <AirServiceContext.Provider value={airService}>
      {children}
    </AirServiceContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useAirService = () => {
  return useContext(AirServiceContext);
};
