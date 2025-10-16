import { useState, useMemo } from "react";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ExclusiveMarket } from "@/lib/types";
import { EXCLUSIVE_DUMMY_MARKETS } from "@/lib/exclusive-dummy-data";
import { ExclusiveMarketCard } from "./ExclusiveMarketCard";
import { ExclusiveMarketDetail } from "./ExclusiveMarketDetail";

export const ExclusiveMarkets = () => {
  const [markets] = useState<ExclusiveMarket[]>(EXCLUSIVE_DUMMY_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<ExclusiveMarket | null>(
    null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Filter for markets that are still within their exclusive period
  const activeExclusiveMarkets = useMemo(() => {
    const now = Date.now();
    return markets.filter((market) => market.exclusiveUntil * 1000 > now);
  }, [markets]);

  const handleSelectMarket = (market: ExclusiveMarket) => {
    setSelectedMarket(market);
  };

  const handleCloseDetail = () => {
    setSelectedMarket(null);
  };

  if (activeExclusiveMarkets.length === 0) {
    return null; // Don't render anything if there are no active exclusive markets
  }

  if (isDesktop) {
    return (
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Exclusive Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeExclusiveMarkets.map((market) => (
                <ExclusiveMarketCard
                  key={market.id}
                  market={market}
                  onSelect={handleSelectMarket}
                  isSelected={selectedMarket?.id === market.id}
                />
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            {selectedMarket && (
              <div className="sticky top-24">
                <ExclusiveMarketDetail
                  market={selectedMarket}
                  onClose={handleCloseDetail}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile View with Drawer
  return (
    <Drawer.Root
      open={!!selectedMarket}
      onClose={handleCloseDetail}
      shouldScaleBackground
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Exclusive Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeExclusiveMarkets.map((market) => (
            <ExclusiveMarketCard
              key={market.id}
              market={market}
              onSelect={handleSelectMarket}
            />
          ))}
        </div>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            {selectedMarket && (
              <ExclusiveMarketDetail
                market={selectedMarket}
                onClose={handleCloseDetail}
              />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
