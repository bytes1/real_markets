import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type FollowerMarket } from "@/lib/types";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Users } from "lucide-react"; // Icon for the follower badge

export function FollowerMarketCard({ market }: { market: FollowerMarket }) {
  return (
    // The Link now wraps the entire Card
    <Link
      to={`/follower-market/${market.id}`}
      className="w-full max-w-[350px] transition-all hover:scale-[1.02] hover:shadow-lg"
    >
      <Card className="w-full bg-gray-900/50 border-gray-700/50 text-white flex flex-col justify-between h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            {/* Placeholder for the image */}
            <img
              src={market.imageUrl || "/vite.svg"}
              alt={market.category}
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <div>
              <CardTitle className="text-base leading-snug">
                {market.condition}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <span className="text-xs text-gray-400">Yes</span>
              <span className="block text-2xl font-bold text-green-400">
                ${market.priceYes.toFixed(2)}
              </span>
            </div>
            {/* Main Probability */}
            <div className="text-center">
              <span className="text-sm text-gray-400">Probability</span>
              <span className="block text-4xl font-bold text-white">
                {market.probability.toFixed(1)}%
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-400">No</span>
              <span className="block text-2xl font-bold text-red-400">
                ${market.priceNo.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-gray-400">
          <div>
            Liquidity:{" "}
            <span className="font-bold text-white">
              ${market.liquidity.toLocaleString()}
            </span>
          </div>
          {/* Specific Follower Market Badge */}
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-900/50 text-blue-300 border-blue-700"
          >
            <Users className="w-3 h-3" />
            {market.category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
