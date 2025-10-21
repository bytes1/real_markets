import { useParams } from "react-router-dom";
import { followerMarkets } from "@/lib/follower-dummy-data";
import { FollowerMarketDetail } from "@/components/FollowerMarketDetail";

export function FollowerMarketFullPage() {
  const { id } = useParams<{ id: string }>();
  const market = followerMarkets.find((m) => m.id === Number(id));

  if (!market) {
    return <div className="text-center text-white">Market not found</div>;
  }

  return <FollowerMarketDetail market={market} />;
}
