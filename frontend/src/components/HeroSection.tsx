import { Button } from "@/components/ui/button"; // Assuming you have shadcn button
import React from "react";
import { useAirService } from "../contexts/AirServiceContext"; // Import the hook
import { useAccount } from "wagmi"; // Import useAccount to check connection status
// --- Sub-components for better organization ---

import { generateJwt } from "@/utils/jwt";

const LargeBanner = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1d] text-white p-8 md:p-12 lg:p-16 rounded-lg overflow-hidden">
      {/* Background patterns/shapes (adjust as needed for exact match) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <circle cx="20" cy="80" r="15" fill="purple" opacity="0.5" />
          <rect
            x="60"
            y="10"
            width="30"
            height="30"
            fill="cyan"
            opacity="0.4"
          />
          <polygon points="50,0 60,20 40,20" fill="magenta" opacity="0.6" />
        </svg>
      </div>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://via.placeholder.com/1500x500/000000/FFFFFF?text=Background+Pattern')",
        }}
      ></div>

      <div className="relative z-10 max-w-5xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          TRADE ON TRUE MARKETS <br />
          <span className="flex items-center gap-4">
            <span className="inline-block transform -rotate-45 text-purple-400">
              →
            </span>
            FORECAST
          </span>
          THE FUTURE
        </h1>
        <Button
          variant="default"
          className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-lg shadow-lg"
        >
          START TRADING
        </Button>
      </div>
    </div>
  );
};

interface SmallCardProps {
  title: string;
  description?: string;
  bgColor: string;
  textColor?: string;
  hasLiveIndicator?: boolean;
}

const SmallCard = ({
  title,
  description,
  bgColor,
  textColor = "text-white",
  hasLiveIndicator = false,
}: SmallCardProps) => {
  return (
    <div
      className={`relative ${bgColor} ${textColor} p-6 rounded-lg h-full flex flex-col justify-between`}
    >
      {hasLiveIndicator && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE
        </span>
      )}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  );
};

// --- Main Hero Section Component ---
export const HeroSection = () => {
  const airService = useAirService(); // Get the instance from context
  const { isConnected } = useAccount(); // Check if a wallet is connected
  const partnerId = "8a222988-f7f8-42d3-9b39-543d93d6fb16";
  const programId = "c21pp030oeirj0051859o0";
  const redirectUrl = "http://localhost:5173/issue";
  const privateKey = `-----BEGIN PRIVATE KEY-----
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
XhLHThWNFhrfDfcVsodUBVoT2dHuPOU=
-----END PRIVATE KEY-----`;
  const kid = "6386cb4d-c0de-4629-a412-8dcf6f50f805";
  const jwtAlgorithm = "RS256";

  const handleTestAirService = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!airService) {
      // This should not happen if the context is set up correctly
      alert("AirService is not initialized. Check the console for errors.");
      return;
    }

    try {
      const jwt = await generateJwt({
        partnerId,
        privateKey,
        kid,
        jwtAlgorithm,
      });

      if (!jwt) {
        throw new Error("Failed to generate JWT");
      }

      const result = await airService.verifyCredential({
        authToken: jwt,
        programId: programId,
      });
      // This is a simple, safe function to test the connection

      console.log("AirService test successful! User Info:", result);
      alert(`Successfully fetched user info: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("AirService test failed:", error);
      alert("An error occurred while using AirService. Check the console.");
    }
  };
  return (
    <div className="p-4 md:p-8 space-y-6">
      <LargeBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SmallCard title="Points" bgColor="bg-[#1a1a2e]" />
        <SmallCard
          title="Hourly  Challenge"
          description="$10k USDC prize pool  Enroll and start trading" // Use \n for line breaks
          bgColor="bg-lime-300"
          textColor="text-black"
          hasLiveIndicator={true}
        />

        {/* <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h3>AirService Test Panel</h3>
          <Button onClick={handleTestAirService}>Test Get User Info</Button>
        </div> */}
      </div>
    </div>
  );
};
