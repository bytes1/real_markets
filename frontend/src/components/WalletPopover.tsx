import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WalletBalanceCard from "./WalletBalanceCard";
import { Link } from "react-router-dom"; // +++ Import Link
import { Separator } from "@/components/ui/separator"; // +++ Import Separator

export function WalletPopover() {
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useBalance({ address });

  const displayBalance =
    isConnected && nativeBalance
      ? `${parseFloat(formatEther(nativeBalance.value)).toFixed(2)} ${
          nativeBalance.symbol
        }`
      : "0.00 USD";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full font-semibold text-sm px-4 h-9"
        >
          {displayBalance}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-lg rounded-2xl">
        <WalletBalanceCard />
        <Separator />
        <Link to="/profile" className="w-full">
          <Button
            variant="ghost"
            className="w-full rounded-t-none rounded-b-2xl justify-start px-4 py-3 font-medium"
          >
            My Profile
          </Button>
        </Link>
        <Separator />
      </PopoverContent>
    </Popover>
  );
}
