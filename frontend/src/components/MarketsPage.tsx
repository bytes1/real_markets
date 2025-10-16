import { useState } from "react";
import { MarketCard, type Market } from "@/components/MarketCard";
import { MarketDetail } from "@/components/MarketDetail";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMarketData } from "@/hooks/useMarketData"; // <-- Import the new hook

// Mock data now only contains static information.
// Probability and Liquidity will be fetched from the chain.
export const initialMarkets = [
  {
    id: 1,
    condition: "Will Ethereum's price surpass $10,000 by the end of 2025?",
    date: "Sep 29, 20:00 UTC",
    address: "0x6E98B581D06F88865Efb2E36fE013a44d575Da25" as `0x${string}`,
  },
  {
    id: 2,
    condition: "Will the global crypto market cap exceed $5 trillion in 2025?",
    date: "Sep 24, 20:00 UTC",
    address: "0xbf68A59eeeB7C9F03ca42bccF3B179Becd83fecc" as `0x${string}`,
  },
  {
    id: 3,
    condition:
      "Will a major central bank issue a consumer-facing CBDC before 2027?",
    date: "Sep 24, 20:00 UTC",
    address: "0xa6cb11739cDBD0b6182Fc93B35AAAc84dC3659ac" as `0x${string}`,
  },
];

export const MarketsPage = () => {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Use the custom hook to get dynamic market data
  const { markets, isLoading, error } = useMarketData(initialMarkets);

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
    if (!isDesktop) {
      setDrawerOpen(true);
    }
  };

  const handleClose = () => {
    // No need to deselect market on drawer close, as it's handled by onOpenChange
    setDrawerOpen(false);
  };

  // Handle loading and error states for a better UX
  if (isLoading) {
    return <div>Loading markets...</div>; // Replace with a spinner or skeleton loader
  }

  if (error) {
    return <div>Error loading markets. Please try again later.</div>;
  }

  const marketGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={market}
          onSelect={handleSelectMarket}
          isSelected={selectedMarket?.id === market.id}
        />
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 ">
        <div className="flex flex-row gap-6">
          <div className="flex-1">{marketGrid}</div>
          {selectedMarket && (
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <MarketDetail
                market={selectedMarket}
                onClose={() => setSelectedMarket(null)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile View
  return (
    <div className="p-4 md:p-8 bg-gray-50 ">
      {marketGrid}
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          {selectedMarket && (
            <div className="p-4">
              <MarketDetail market={selectedMarket} onClose={handleClose} />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};
