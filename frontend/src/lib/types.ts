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
