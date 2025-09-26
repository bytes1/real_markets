import { useMemo } from "react";
import { useContractsWatcher } from "@/hooks/useContractsWatcher";
import { PredictionMarketABI, ERC20_ABI } from "@/lib/abi";
import type { Market } from "@/components/MarketCard";

// Define a type for the initial markets to ensure they have an address.
type InitialMarket = {
  id: number;
  condition: string;
  date: string;
  address: `0x${string}`;
};
const USDC_CONTRACT_ADDRESS =
  "0xE73559ce9FD6dde324210A4D250610F41728029d" as const;
// This helper function safely converts BigInt to number and handles formatting.
const formatUnits = (value: unknown, decimals: number = 6): number => {
  if (typeof value !== "bigint") return 0;
  return Number(value) / 10 ** decimals;
};

export const useMarketData = (initialMarkets: InitialMarket[]) => {
  // 1. Dynamically generate the contract calls based on the markets array.
  // This is scalable and avoids hardcoding.
  const contracts = useMemo(() => {
    return initialMarkets.flatMap((market) => [
      // Get YES shares
      {
        address: market.address,
        abi: PredictionMarketABI,
        functionName: "outcomeShares",
        args: [0], // YES outcome
      },
      // Get NO shares
      {
        address: market.address,
        abi: PredictionMarketABI,
        functionName: "outcomeShares",
        args: [1], // NO outcome
      },
      // Get total liquidity (USDC balance of the market contract)
      {
        address: USDC_CONTRACT_ADDRESS, // Assuming this is the USDC contract address
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [market.address],
      },
    ]);
  }, [initialMarkets]);

  const { data, isLoading, error } = useContractsWatcher(contracts);

  // 2. Process and merge the fetched data with the initial market data.
  // useMemo ensures this complex calculation only runs when the data changes.
  const markets = useMemo<Market[]>(() => {
    if (!data || data.length === 0) {
      // Return initial markets with default values if data isn't loaded yet
      return initialMarkets.map((market) => ({
        ...market,
        liquidity: 0,
        probability: 50,
        priceYes: 0.5, // Default price
        priceNo: 0.5, // Default price
      }));
    }

    // Since we create 3 calls per market, we process the results in chunks of 3.
    return initialMarkets.map((market, index) => {
      const resultIndex = index * 3;
      const yesShares = (data[resultIndex] as { result: bigint })?.result ?? 0n;
      const noShares =
        (data[resultIndex + 1] as { result: bigint })?.result ?? 0n;
      const liquidityRaw =
        (data[resultIndex + 2] as { result: bigint })?.result ?? 0n;

      const totalShares = yesShares + noShares;
      const probability =
        totalShares > 0n ? Number((yesShares * 1000n) / totalShares) / 10 : 50;

      // --- NEW: Calculate prices from probability ---
      const priceYes = probability / 100;
      const priceNo = (100 - probability) / 100;
      // ---------------------------------------------

      return {
        ...market,

        liquidity: formatUnits(liquidityRaw, 18),
        probability,
        priceYes, // <-- Add to returned object
        priceNo, // <-- Add to returned object
      };
    });
  }, [initialMarkets, data]);

  return { markets, isLoading, error };
};
