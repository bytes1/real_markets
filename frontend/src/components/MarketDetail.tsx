import { ArrowLeft, Diamond, ExternalLink, Share2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Market } from "./MarketCard";
import { MarketTradePanel } from "./MarketTradePanel"; // <-- Import new component

interface MarketDetailProps {
  market: Market;
  onClose?: () => void;
  variant?: "panel" | "fullpage";
}

// This component is memoized to prevent re-renders unless its props change.
export const MarketDetail = ({
  market,
  onClose,
  variant = "panel",
}: MarketDetailProps) => {
  const navigate = useNavigate();
  const isFullPage = variant === "fullpage";

  return (
    <div className={isFullPage ? "p-8 max-w-5xl mx-auto" : ""}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {isFullPage ? (
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <span className="text-sm text-gray-500">Ends in 00h:00m:00s</span>
        )}
        <div className="flex items-center gap-2">
          {!isFullPage && (
            <Link to={`/market/${market.id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" /> Full page
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          {!isFullPage && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        className={`grid gap-8 ${
          isFullPage ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Left Section: Market Info */}
        <div>
          <h2
            className={`font-bold flex items-center gap-2 mb-2 ${
              isFullPage ? "text-3xl" : "text-lg"
            }`}
          >
            <Diamond className="w-6 h-6 text-blue-500" />
            <span>{market.condition}</span>
          </h2>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span className="text-green-500">
              Yes {market.probability.toFixed(1)}%
            </span>
            <span className="text-red-500">
              No {(100 - market.probability).toFixed(1)}%
            </span>
          </div>
          <Progress value={market.probability} className="h-2 mb-4" />
          <div className="flex gap-2 mb-4">
            <Button variant="outline" className="flex-1">
              Earn 20 USDC
            </Button>
            <Button variant="outline" className="flex-1">
              Volume {market.liquidity.toLocaleString()} USDC
            </Button>
          </div>
          <Card className="mt-4">
            <CardContent className="p-4">
              <p className="font-bold mb-2">
                {market.probability.toFixed(1)}% Chance
              </p>
              <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-400">[Chart Placeholder]</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Trading Panel */}
        <MarketTradePanel market={market} />
      </div>
    </div>
  );
};
