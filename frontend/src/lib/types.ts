// This is the new type for Exclusive Markets.
export type ExclusiveMarket = {
  id: number;
  condition: string;
  date: string;
  liquidity: number;
  probability: number;
  address: string;
  priceYes: number;
  priceNo: number;
  exclusiveUntil: number;
  requiredTier: number;
  requiredTradeCount: number;
};
export interface Market {
  id: number;
  condition: string;
  date: string;
  liquidity: number;
  probability: number;
  address: `0x${string}`;
  priceYes: number;
  priceNo: number;
}

export interface FollowerMarket extends Market {
  accessCondition: string; // e.g., "Requires Moca Network Twitter Follow"
  verificationUrl: string; // A link to the (dummy) verification page
  category: string; // e.g., "Social"
  imageUrl: string; // A placeholder image URL
}
