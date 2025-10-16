import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          ? "border-primary ring-2 ring-primary"
          : "hover:border-gray-400"
      }`}
      onClick={() => onSelect(market)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Diamond className="w-5 h-5 text-primary" />
          <span>{market.condition}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Probability</p>
            <p className={`text-2xl font-bold ${probabilityColor}`}>
              {market.probability.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Liquidity</p>
            <p className="text-lg font-medium">
              {market.liquidity.toLocaleString()} USDC
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>00h:00m:00s</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">YES</Button>
          <Button variant="outline">NO</Button>
        </div>
      </CardContent>
    </Card>
  );
};
