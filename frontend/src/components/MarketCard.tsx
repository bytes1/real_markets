import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Diamond } from "lucide-react";

// Define the type for the market data
export type Market = {
  id: number;
  condition: string;
  date: string;
  liquidity: number;
  probability: number;
  address: string;
  priceYes: number; // <-- Add this
  priceNo: number; // <-- Add this
};

interface MarketCardProps {
  market: Market;
  onSelect: (market: Market) => void;
  isSelected?: boolean;
}

export const MarketCard = ({
  market,
  onSelect,
  isSelected = false,
}: MarketCardProps) => {
  const probabilityColor =
    market.probability > 50 ? "text-green-500" : "text-red-500";

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500"
          : "hover:border-gray-400"
      }`}
      onClick={() => onSelect(market)}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-md flex items-center gap-2">
            <Diamond className="w-4 h-4 text-blue-500" />
            <span>{market.condition}</span>
          </h3>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              market.probability > 50 ? "border-green-500" : "border-red-500"
            }`}
          >
            <span className={`font-semibold text-sm ${probabilityColor}`}>
              {market.probability.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>00h:00m:00s</span>
          </div>
          <div className="flex items-center gap-1">
            <Diamond className="w-4 h-4 text-gray-400" />
            <span>{market.liquidity.toLocaleString()} USDC</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="bg-green-100 text-green-700 hover:bg-green-200"
          >
            YES
          </Button>
          <Button
            variant="outline"
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            NO
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
