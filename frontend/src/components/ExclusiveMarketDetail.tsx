import {
  ArrowLeft,
  Diamond,
  ExternalLink,
  Share2,
  X,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ExclusiveMarket } from "@/lib/types";
import { MarketTradePanel } from "./MarketTradePanel";

interface ExclusiveMarketDetailProps {
  market: ExclusiveMarket;
  onClose?: () => void;
  variant?: "panel" | "fullpage";
}

export const ExclusiveMarketDetail = ({
  market,
  onClose,
  variant = "panel",
}: ExclusiveMarketDetailProps) => {
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

          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-bold text-blue-800">
                    Exclusive Access Period
                  </p>
                  <p className="text-sm text-blue-700">
                    This market has special participation requirements.
                  </p>
                  <ul className="text-xs list-disc list-inside mt-1 text-blue-600">
                    <li>Required Tier: {market.requiredTier}</li>
                    <li>Required Trades: {market.requiredTradeCount}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>

        {/* Right Section: Trading Panel */}
        <MarketTradePanel market={market} mode={"exclusive"} />
      </div>
    </div>
  );
};
