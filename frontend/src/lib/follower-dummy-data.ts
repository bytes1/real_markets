import { type FollowerMarket } from "./types";

export const followerMarkets: FollowerMarket[] = [
  {
    id: 1,
    condition: "Will Moca Network reach 1M followers by end of 2025?",
    date: "2025-12-31",
    liquidity: 25000,
    probability: 60.5,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    priceYes: 0.61,
    priceNo: 0.39,
    accessCondition: "Requires Moca Network Twitter Follow",
    verificationUrl: "#",
    category: "Social", // <-- ADDED
    imageUrl: "/vite.svg", // <-- ADDED (placeholder)
  },
  {
    id: 2,
    condition: "Will Real Market's X account surpass 100k followers this year?",
    date: "2024-12-31",
    liquidity: 10000,
    probability: 75.0,
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    priceYes: 0.75,
    priceNo: 0.25,
    accessCondition: "Requires Real Market Twitter Follow",
    verificationUrl: "#",
    category: "Social", // <-- ADDED
    imageUrl: "/vite.svg", // <-- ADDED (placeholder)
  },
];
