import { useParams, Link } from "react-router-dom";
import { MarketDetail } from "@/components/MarketDetail";
// We'll use the static initialMarkets to find the address and other static info
import { initialMarkets } from "../components/MarketsPage";
import { useMarketData } from "@/hooks/useMarketData";

export const MarketFullPage = () => {
  const { marketId } = useParams<{ marketId: string }>();

  // 1. Find the base market info (like address) from our static list.
  const initialMarket = initialMarkets.find(
    (m) => m.id === parseInt(marketId || "")
  );

  // 2. If the market exists, pass it (in an array) to our data-fetching hook.
  // The hook is designed to take an array, so we wrap `initialMarket`.
  const { markets, isLoading, error } = useMarketData(
    initialMarket ? [initialMarket] : []
  );

  // The hook will return an array with our single, updated market.
  const liveMarket = markets[0];

  // Handle loading and error states from the hook
  if (isLoading) {
    return <div className="p-8 text-center">Loading market data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center">Error loading market data.</div>;
  }

  // Handle the case where the market ID is invalid from the start.
  if (!initialMarket || !liveMarket) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Market not found</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to all markets
        </Link>
      </div>
    );
  }

  // 3. Render the MarketDetail with the live, on-chain data.
  return (
    <div className="bg-gray-50 min-h-screen">
      <MarketDetail market={liveMarket} variant="fullpage" />
    </div>
  );
};
