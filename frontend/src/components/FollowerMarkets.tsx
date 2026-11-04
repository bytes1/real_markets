import { followerMarkets } from "@/lib/follower-dummy-data";
import { FollowerMarketCard } from "./FollowerMarketCard";

export function FollowerMarkets() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        Friends Markets
      </h2>
      {/* --- This is the corrected line --- */}
      <div className="flex flex-wrap justify-start gap-6">
        {followerMarkets.map((market) => (
          <FollowerMarketCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}
