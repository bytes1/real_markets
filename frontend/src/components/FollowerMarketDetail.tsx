import { type FollowerMarket } from "@/lib/types";
// Import the new, separate trade panel
import { FollowerMarketTradePanel } from "./FollowerMarketTradePanel";

export function FollowerMarketDetail({ market }: { market: FollowerMarket }) {
  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-2">{market.condition}</h1>
      <p className="text-gray-400 mb-6">Market ends: {market.date}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* You can place a chart component here */}
          <div className="h-96 bg-gray-900/50 border border-gray-700/50 rounded-lg flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>
        <div className="md:col-span-1">
          {/* It renders the new panel */}
          <FollowerMarketTradePanel market={market} />
        </div>
      </div>
    </div>
  );
}
