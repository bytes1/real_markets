import type { ExclusiveMarket } from "./types";

// Get a future timestamp for the exclusive period (e.g., 24 hours from now)
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const exclusiveEndTime = Math.floor(tomorrow.getTime() / 1000);

export const EXCLUSIVE_DUMMY_MARKETS: ExclusiveMarket[] = [
  {
    id: 3,
    condition: "Will a Bitcoin Spot ETF be approved in Australia this year?",
    date: "2024-12-31",
    liquidity: 50000,
    probability: 80.1,
    address: "0x1111222233334444555566667777888899990000",
    priceYes: 0.8,
    priceNo: 0.2,
    exclusiveUntil: exclusiveEndTime,
    requiredTier: 2,
    requiredTradeCount: 10,
  },
  {
    id: 4,
    condition: "Will Solana's market cap surpass Ethereum's by 2025?",
    date: "2025-01-01",
    liquidity: 95000,
    probability: 22.8,
    address: "0xaaaabbbbccccddddeeeeffff0000111122223333",
    priceYes: 0.23,
    priceNo: 0.77,
    exclusiveUntil: exclusiveEndTime,
    requiredTier: 1,
    requiredTradeCount: 5,
  },
];
